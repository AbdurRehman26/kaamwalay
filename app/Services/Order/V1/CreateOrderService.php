<?php

namespace App\Services\Order\V1;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Services\Admin\Order\OrderItemService;
use App\Services\Admin\V1\OrderStatusHistoryService;
use App\Services\Coupon\CouponService;
use App\Services\Order\OrderNumberGeneratorService;
use App\Services\Order\Shipping\ShippingFeeService;
use App\Services\Order\Validators\CouponAppliedValidator;
use App\Services\Order\Validators\CustomerAddressValidator;
use App\Services\Order\Validators\GrandTotalValidator;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use App\Services\Order\Validators\WalletAmountGrandTotalValidator;
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
        protected OrderStatusHistoryService $orderStatusHistoryService,
        protected OrderItemService $orderItemService,
        protected CouponService $couponService
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
        $this->storePaymentMethod(
            $this->getPaymentMethod($this->data)
        );
        $this->storeOrderAddresses($this->data['shipping_address'], $this->data['billing_address'], $this->data['customer_address']);
        $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        $this->saveOrder();
        $this->storeOrderItems($this->data['items']);
        $this->storeCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storePaymentMethodDiscount($this->data['payment_method'] ?? []);
        $this->storeGrandTotal();
        $this->storeWalletPaymentAmount(! empty($this->data['payment_by_wallet']) ? $this->data['payment_by_wallet'] : null);
        $this->storeOrderPayment($this->data);

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::DEFAULT_ORDER_STATUS, $this->order);

        DB::commit();
    }

    protected function startOrder(): void
    {
        $this->order = new Order();
    }

    protected function storePaymentPlan(array $paymentPlan): void
    {
        $this->order->payment_plan_id = $paymentPlan['id'];
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
            $shippingAddress = OrderAddress::create($shippingAddress);
        }

        $this->order->shippingAddress()->associate($shippingAddress);

        if ($billingAddress['same_as_shipping']) {
            $this->order->billingAddress()->associate($shippingAddress);
        } else {
            $billingAddress = OrderAddress::create($billingAddress);
            $this->order->billingAddress()->associate($billingAddress);
        }
    }

    protected function storeCustomerAddress(array $shippingAddress, array $customerAddress): void
    {
        if ($shippingAddress['save_for_later'] && empty($customerAddress['id'])) {
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
        $shippingFee = ShippingFeeService::calculateForOrder($this->order);

        $this->order->shipping_fee = $shippingFee;
        $this->order->save();
    }

    protected function storeServiceFee(): void
    {
        $this->order->service_fee = $this->order->paymentPlan->price * $this->order->orderItems()->sum('quantity');
        $this->order->save();
    }

    protected function storeGrandTotal(): void
    {
        $this->order->grand_total_before_discount = $this->order->service_fee + $this->order->shipping_fee;
        $this->order->grand_total = $this->order->service_fee + $this->order->shipping_fee - $this->order->discounted_amount - $this->order->payment_method_discounted_amount;

        GrandTotalValidator::validate($this->order);

        $this->order->save();
    }

    protected function storeOrderPayment(array $data)
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
            OrderPayment::create([
                'order_id' => $orderPaymentData['order_id'],
                'payment_method_id' => PaymentMethod::getWalletPaymentMethod()->id,
                'amount' => $this->order->amount_paid_from_wallet,
            ]);
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
}
