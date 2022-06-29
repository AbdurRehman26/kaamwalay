<?php

namespace App\Services\Order\V2;

use App\Events\API\Customer\Order\OrderPlaced;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Country;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\OrderPaymentPlan;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Services\Admin\Order\OrderItemService;
use App\Services\Admin\V2\OrderStatusHistoryService;
use App\Services\CleaningFee\CleaningFeeService;
use App\Services\Coupon\CouponService;
use App\Services\Order\OrderNumberGeneratorService;
use App\Services\Order\Shipping\ShippingFeeService;
use App\Services\Order\Validators\CouponAppliedValidator;
use App\Services\Order\Validators\CustomerAddressValidator;
use App\Services\Order\Validators\GrandTotalValidator;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use App\Services\Order\Validators\V2\WalletAmountGrandTotalValidator;
use App\Services\Order\Validators\WalletCreditAppliedValidator;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class CreateOrderService
{
    protected Order $order;
    protected array $data;

    public function __construct(
        protected OrderItemService $orderItemService,
        protected CouponService $couponService,
        protected OrderStatusHistoryService $orderStatusHistoryService
    ) {
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Order
    {
        $this->data = $data;

        try {
            $this->validate();
            $this->process();

            return $this->order;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }

    /**
     * @throws Exception
     */
    protected function validate(): void
    {
        ItemsDeclaredValueValidator::validate($this->data);
        CustomerAddressValidator::validate($this->data);
        CouponAppliedValidator::validate($this->data);
        WalletCreditAppliedValidator::validate($this->data);
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    protected function process(): void
    {
        DB::beginTransaction();

        $this->startOrder();
        $this->storePaymentPlan($this->data['payment_plan']);
        $this->storeShippingMethod($this->data['shipping_method']);
        if ($this->order->hasInsuredShipping()) {
            $this->storeOrderAddresses($this->data['shipping_address'], $this->data['billing_address'], $this->data['customer_address']);
            $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        }
        $this->saveOrder();
        $this->storeOrderItems($this->data['items']);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storeCleaningFee();
        $this->storeCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->storeGrandTotal();
        $this->storeWalletPaymentAmount(! empty($this->data['payment_by_wallet']) ? $this->data['payment_by_wallet'] : null);
        $this->associateSalesman();

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $this->order);
        OrderPlaced::dispatch($this->order);

        DB::commit();
    }

    protected function startOrder(): void
    {
        $this->order = new Order();
    }

    protected function storePaymentPlan(array $paymentPlan): void
    {
        $this->order->payment_plan_id = $paymentPlan['id'];

        $paymentPlan = PaymentPlan::find($paymentPlan['id']);

        $orderPaymentPlan = OrderPaymentPlan::create([
            'price' => $paymentPlan->price,
            'max_protection_amount' => $paymentPlan->max_protection_amount,
            'turnaround' => $paymentPlan->turnaround,
        ]);

        $this->order->paymentPlan()->associate($orderPaymentPlan);
    }

    protected function storeShippingMethod(array $shippingMethod): void
    {
        $this->order->shipping_method_id = $shippingMethod['id'];
    }

    protected function getPaymentMethod(array $data): array
    {
        return ! empty($data['payment_method']) ? $data['payment_method'] : PaymentMethod::getWalletPaymentMethod()->toArray();
    }

    protected function storePaymentMethod(array $paymentMethod): void
    {
        $this->order->payment_method_id = $paymentMethod['id'];
    }

    protected function storeOrderAddresses(array $shippingAddress, array $billingAddress, array $customerAddress): void
    {
        if (! empty($customerAddress['id'])) {
            $shippingAddress = OrderAddress::create(CustomerAddress::find($customerAddress['id'])->toArray());
        } else {
            $shippingAddress['country_id'] = Country::whereCode($shippingAddress['country_code'] ?? 'US')->first()->id;
            $shippingAddress = OrderAddress::create($shippingAddress);
        }

        $this->order->shippingAddress()->associate($shippingAddress);

        if ($billingAddress['same_as_shipping']) {
            $this->order->billingAddress()->associate($shippingAddress);
        } else {
            $billingAddress['country_id'] = Country::whereCode($billingAddress['country_code'] ?? 'US')->first()->id;
            $billingAddress = OrderAddress::create($billingAddress);
            $this->order->billingAddress()->associate($billingAddress);
        }
    }

    protected function storeCustomerAddress(array $shippingAddress, array $customerAddress): void
    {
        if ($shippingAddress['save_for_later'] && empty($customerAddress['id'])) {
            $shippingAddress['country_id'] = Country::whereCode($shippingAddress['country_code'] ?? 'US')->first()->id;
            CustomerAddress::create(array_merge(
                $shippingAddress,
                [
                    'user_id' => auth()->user()->id,
                ]
            ));
        }
    }

    protected function saveOrder(): void
    {
        $this->order->user()->associate(auth()->user());
        $this->order->save();
        $this->order->order_number = OrderNumberGeneratorService::generate($this->order);
        $this->order->save();
    }

    /**
     * @throws OrderItemDoesNotBelongToOrder
     */
    protected function storeOrderItems(array $items): void
    {
        foreach ($items as $item) {
            for ($i = 0; $i < $item['quantity']; $i++) {
                $storedItem = OrderItem::create([
                    'order_id' => $this->order->id,
                    'card_product_id' => $item['card_product']['id'],
                    'quantity' => 1,
                    'declared_value_per_unit' => $item['declared_value_per_unit'],
                    'declared_value_total' => $item['declared_value_per_unit'],
                ]);
                $this->orderItemService->changeStatus($this->order, $storedItem, ['status' => 'pending'], auth()->user());
            }
        }
    }

    protected function storeShippingFee(): void
    {
        $this->order->shipping_fee = ShippingFeeService::calculateForOrder($this->order);
        $this->order->save();
    }

    protected function storeServiceFee(): void
    {
        $this->order->service_fee = $this->order->paymentPlan->price * $this->order->orderItems()->sum('quantity');
        $this->order->save();
    }

    protected function storeGrandTotal(): void
    {
        $this->order->grand_total_before_discount = $this->order->service_fee + $this->order->shipping_fee + $this->order->cleaning_fee;
        $this->order->grand_total = $this->order->grand_total_before_discount - $this->order->discounted_amount - $this->order->payment_method_discounted_amount;

        GrandTotalValidator::validate($this->order);

        $this->order->save();
    }

    protected function storeOrderPayment(array $data): void
    {
        $orderPaymentData = [
            'order_id' => $this->order->id,
            'payment_method_id' => $this->order->paymentMethod->id,
        ];
        if ($this->order->paymentMethod->code === 'stripe') {
            $response = $this->order->user->findPaymentMethod($data['payment_provider_reference']['id']);
            $orderPaymentData = array_merge(
                $orderPaymentData,
                [
                    'response' => json_encode($response),
                    'payment_provider_reference_id' => $data['payment_provider_reference']['id'],
                ]
            );
        }

        OrderPayment::create($orderPaymentData);

        /* Amount is partially paid from wallet since the primary payment method is not wallet */
        if ($this->order->amount_paid_from_wallet && ! $this->order->paymentMethod->isWallet()) {
            $walletPayment = new OrderPayment([
                'order_id' => $orderPaymentData['order_id'],
                'payment_method_id' => PaymentMethod::getWalletPaymentMethod()->id,
                'amount' => $this->order->amount_paid_from_wallet,
                // oldestOfMany and latestOfMany are using created_at field to fetch the record, during the flow
                // if there are order payments, then they are created at the same time which is causing error.
                // The primary payment method (firstOrderPayment) will always be other than wallet in the case of
                // partial payment.
                'created_at' => now()->addMinute(),
                'updated_at' => now()->addMinute(),
            ]);
            $walletPayment->timestamps = false;

            $walletPayment->save();
        }
    }

    protected function storeCouponAndDiscount(array $couponData): void
    {
        if (! empty($couponData['code'])) {
            $this->order->coupon_id = $this->couponService->returnCouponIfValid($couponData['code'])->id;
            $this->order->discounted_amount = $this->couponService->calculateDiscount($this->order->coupon, $this->order);
            $this->order->save();
        }
    }

    protected function storePaymentMethodDiscount(array $paymentMethod): void
    {
        if (! array_key_exists('id', $paymentMethod)) {
            return;
        }

        $paymentMethod = PaymentMethod::find($paymentMethod['id']);

        if ($paymentMethod->isCollectorCoin()) {
            $this->order->payment_method_discounted_amount = round($this->order->service_fee * config('robograding.collector_coin_discount_percentage') / 100, 2);
        }
    }

    protected function storeWalletPaymentAmount(float|null $amount): void
    {
        if (! empty($amount)) {
            WalletAmountGrandTotalValidator::validate($this->order, $amount);
            $this->order->amount_paid_from_wallet = $amount;
            $this->order->save();
        }
    }

    protected function associateSalesman(): void
    {
        if ($salesman = $this->order->user->salesman) {
            $this->order->salesman()->associate($salesman)->save();
        }
    }

    protected function storeCleaningFee(): void
    {
        $cleaningFee = 0;
        if (! empty($this->data['requires_cleaning'])) {
            $cleaningFee = (new CleaningFeeService($this->order))->calculate();
        }

        $this->order->cleaning_fee = $cleaningFee;
        $this->order->requires_cleaning = $cleaningFee > 0;
        $this->order->save();
    }
}
