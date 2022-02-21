<?php

namespace App\Services\Order\V2;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\PaymentMethod;
use App\Services\Coupon\CouponService;
use App\Services\Order\Validators\CouponAppliedValidator;
use App\Services\Order\Validators\GrandTotalValidator;
use App\Services\Order\Validators\WalletAmountGrandTotalValidator;
use App\Services\Order\Validators\WalletCreditAppliedValidator;
use Exception;
use Illuminate\Support\Facades\DB;
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
        DB::beginTransaction();

        $this->storePaymentMethod(
            $this->getPaymentMethod($this->data)
        );

        $this->updateOrderCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->updateOrderPaymentMethodDiscount($this->data['payment_method'] ?? []);
        $this->updateGrandTotal();
        $this->updateWalletPaymentAmount(! empty($this->data['payment_by_wallet']) ? $this->data['payment_by_wallet'] : null);
        $this->storeOrderPayment($this->data);

        DB::commit();
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

    protected function updateOrderCouponAndDiscount(array $couponData): void
    {
        if (! empty($couponData['code'])) {
            $this->order->coupon_id = $this->couponService->returnCouponIfValid($couponData['code'])->id;
            $this->order->discounted_amount = $this->couponService->calculateDiscount($this->order->coupon, $this->order);
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
            $this->order->save();
        }
    }

    protected function updateGrandTotal(): void
    {
        $this->order->grand_total_before_discount = $this->order->service_fee + $this->order->shipping_fee;
        $this->order->grand_total = (
            $this->order->service_fee
            + $this->order->shipping_fee
            - $this->order->discounted_amount
            - $this->order->payment_method_discounted_amount
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
        $this->order->payment_method_id = $paymentMethod['id'];
    }
}
