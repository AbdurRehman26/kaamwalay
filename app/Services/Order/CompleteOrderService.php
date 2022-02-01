<?php

namespace App\Services\Order;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderPayment;
use App\Models\PaymentMethod;
use App\Services\Coupon\CouponService;
use App\Services\Order\Shipping\ShippingFeeService;
use App\Services\Order\Validators\CouponAppliedValidator;
use App\Services\Order\Validators\GrandTotalValidator;
use App\Services\Order\Validators\WalletAmountGrandTotalValidator;
use App\Services\Order\Validators\WalletCreditAppliedValidator;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class CompleteOrderService
{
    protected Order $order;
    protected array $data;

    public function __construct(
        private CouponService $couponService
    ) {
    }

    /**
     * @throws Exception
     */
    public function save(Order $order, array $data): Order
    {
        $this->data = $data;
        $this->order = $order;

        try {
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
    protected function validate()
    {
        CouponAppliedValidator::validate($this->data);
        WalletCreditAppliedValidator::validate($this->data);
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    protected function process()
    {
        DB::beginTransaction();

        $this->storeBillingAddress($this->data['billing_address'], $this->data['billing_address']);
        $this->storeCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storePaymentMethodDiscount($this->data['payment_method'] ?? []);
        $this->storeGrandTotal();
        $this->storeWalletPaymentAmount(! empty($this->data['payment_by_wallet']) ? $this->data['payment_by_wallet'] : null);
        $this->storeOrderPayment($this->data);
        $this->saveOrder();

        DB::commit();
    }

    protected function storeBillingAddress(array $billingAddress, array $customerAddress)
    {
        $shippingAddress = CustomerAddress::find($customerAddress['id']);

        if ($billingAddress['same_as_shipping']) {
            $this->order->billingAddress()->associate($shippingAddress);
        } else {
            $billingAddress = OrderAddress::create($billingAddress);
            $this->order->billingAddress()->associate($billingAddress);
        }
    }

    protected function storeShippingFee()
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

    protected function saveOrder(): void
    {
        $this->order->order_step = 'third_step';
        $this->order->save();
    }
}
