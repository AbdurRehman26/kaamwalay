<?php

namespace App\Services\Order\V2;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\PaymentMethod;
use App\Services\Coupon\CouponService;
use App\Services\Order\Validators\CouponAppliedValidator;
use App\Services\Order\Validators\GrandTotalValidator;
use App\Services\Order\Validators\V2\WalletAmountGrandTotalValidator;
use App\Services\Order\Validators\WalletCreditAppliedValidator;
use Exception;
use Faker\Provider\Payment;
use Throwable;

class OrderPaymentService
{
    protected Order $order;
    protected array $data;

    public function __construct(
        protected CouponService $couponService
    ) {
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    public function createPayments(Order $order, array $request): void
    {
        $this->setOrder($order)
            ->setData($request)
            ->validate()
            ->process();
    }

    /**
     * @throws Exception
     */
    protected function validate(): self
    {
        CouponAppliedValidator::validate($this->data);
        WalletCreditAppliedValidator::validate($this->data);

        return $this;
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    protected function process(): void
    {
        // There can be scenarios where order payments exist for an unpaid orders.
        // 1. 3d Secure card is used and client closed the process
        // 2. Customer doesn't approve paypal/metamask payment
        // 3. For any reason, the payment process is not completed.
        $this->deleteOldOrderPayments();
        $this->storePaymentMethod(
            $this->getPaymentMethod($this->data)
        );
        $this->updateOrderCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->updateOrderPaymentMethodDiscount($this->data['payment_method'] ?? []);
        $this->updateGrandTotal();
        $this->updateWalletPaymentAmount(! empty($this->data['payment_by_wallet']) ? $this->data['payment_by_wallet'] : null);
        $this->storeOrderPayment($this->data);
    }

    public function setOrder(Order $order): self
    {
        $this->order = $order;

        return $this;
    }

    public function setData(array $data): self
    {
        $this->data = $data;

        return $this;
    }

    protected function storeOrderPayment(array $data): void
    {
        $orderPaymentData = [
            'order_id' => $this->order->id,
            'payment_method_id' => $this->order->paymentMethod->id,
            'amount' => $this->order->grand_total,
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

        $orderPayment = OrderPayment::firstOrNew(collect($orderPaymentData)->except(['response'])->all());

        $orderPayment->response = json_encode($response ?? []);

        $orderPayment->save();


        /* Amount is partially paid from wallet since the primary payment method is not wallet */
        if ($this->order->amount_paid_from_wallet && ! $this->order->paymentMethod->isWallet()) {
            $partialPayment = OrderPayment::firstOrNew([
                'order_id' => $orderPaymentData['order_id'],
                'payment_method_id' => PaymentMethod::getWalletPaymentMethod()->id,
                'type' => OrderPayment::TYPE_ORDER_PAYMENT,
            ]);

            $partialPayment->created_at = now()->addMinute();
            $partialPayment->updated_at = now()->addMinute();
            $partialPayment->amount = $this->order->amount_paid_from_wallet;
            $partialPayment->timestamps = false;
            $partialPayment->save();
        }

        // The next step from here would be to charge the user in the application flow. To make the flow consistent
        // the first order payments can only be either order payment from payment method or wallet and second
        // order payment can be other payments.
        if ($this->order->extraCharges()->count() > 0) {
            $this->order->extraCharges()->update(['created_at' => now()->addSecond()]);
            $this->order->refunds()->update(['created_at' => now()->addSecond()]);
        }
    }

    protected function updateOrderCouponAndDiscount(array $couponData): void
    {
        if (! empty($couponData['code'])) {
            $coupon = $this->couponService->returnCouponIfValid($couponData['code']);
            $this->order->coupon_id = $coupon->id;
            $this->order->discounted_amount = $this->couponService->calculateDiscount($coupon, $this->order);
            $this->order->save();
        }
    }

    protected function updateOrderPaymentMethodDiscount(array $paymentMethod): void
    {
        if (! array_key_exists('id', $paymentMethod)) {
            return;
        }

        $paymentMethod = PaymentMethod::find($paymentMethod['id']);

        if ($paymentMethod->isCollectorCoin()) {
            $this->order->payment_method_discounted_amount = round($this->order->service_fee * config('robograding.collector_coin_discount_percentage') / 100, 2);
        }
    }

    protected function updateWalletPaymentAmount(float|null $amount): void
    {
        if (! empty($amount)) {
            WalletAmountGrandTotalValidator::validate($this->order, $amount);
            $this->order->amount_paid_from_wallet = $amount;
        }
        $this->order->save();
    }

    protected function updateGrandTotal(): void
    {
        $this->order->grand_total_before_discount = $this->order->service_fee + $this->order->shipping_fee;
        $this->order->grand_total = (
            $this->order->service_fee
            + $this->order->shipping_fee
            - $this->order->discounted_amount
            - $this->order->payment_method_discounted_amount
            - $this->order->refund_total
            + $this->order->extra_charge_total
        );

        GrandTotalValidator::validate($this->order);

        $this->order->save();
    }

    protected function getPaymentMethod(array $data): array
    {
        return ! empty($data['payment_method'])
            ? $data['payment_method']
            : PaymentMethod::getWalletPaymentMethod()->toArray();
    }

    protected function storePaymentMethod(array $paymentMethod): void
    {
        if (! empty($this->data['payment_by_wallet']) && $this->order->grand_total === (float) $this->data['payment_by_wallet']) {
            $this->order->payment_method_id = PaymentMethod::getWalletPaymentMethod()->id;

            return;
        }
        $this->order->payment_method_id = $paymentMethod['id'];
    }

    protected function deleteOldOrderPayments(): void
    {
        $this->order->orderPayments()->where('type', OrderPayment::TYPE_ORDER_PAYMENT)->delete();
    }
}
