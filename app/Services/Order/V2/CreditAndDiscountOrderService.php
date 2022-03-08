<?php

namespace App\Services\Order\V2;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Order;
use App\Models\OrderAddress;
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

class CreditAndDiscountOrderService
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
    protected function validate(): void
    {
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
        $this->storeCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storeGrandTotal();
        $this->storeWalletPaymentAmount(! empty($this->data['payment_by_wallet']) ? $this->data['payment_by_wallet'] : null);
        $this->saveOrder();

        DB::commit();
    }

    protected function getPaymentMethod(array $data): array
    {
        return ! empty($data['payment_method']) ? $data['payment_method'] : PaymentMethod::getWalletPaymentMethod()->toArray();
    }

    protected function storePaymentMethod(array $paymentMethod): void
    {
        $this->order->payment_method_id = $paymentMethod['id'];
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

    protected function storeCouponAndDiscount(array $couponData): void
    {
        if (! empty($couponData['code'])) {
            $this->order->coupon_id = $this->couponService->returnCouponIfValid($couponData['code'])->id;
            $this->order->discounted_amount = $this->couponService->calculateDiscount($this->order->coupon, $this->order);
            $this->order->save();
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
        $this->order->order_step = Order::ORDER_STEPS['ORDER_REVIEW_STEP'];
        $this->order->save();
    }
}
