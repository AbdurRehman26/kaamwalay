<?php

namespace App\Services\Admin\V2;

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Events\API\Admin\Order\RefundSuccessful;
use App\Events\API\Admin\Order\UnpaidOrderExtraCharge;
use App\Events\API\Admin\Order\UnpaidOrderRefund;
use App\Exceptions\API\Admin\Order\FailedExtraCharge;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Services\Admin\V1\OrderService as V1OrderService;
use Illuminate\Support\Facades\DB;

class OrderService extends V1OrderService
{
    /**
     * @throws FailedExtraCharge|Throwable
     */
    public function addExtraCharge(Order $order, User $user, array $data, array $paymentResponse): void
    {
        DB::transaction(function () use ($order, $user, $data, $paymentResponse) {
            $order->updateAfterExtraCharge($data['amount']);

            $order->createOrderPayment($paymentResponse, $user);
        });

        if (! $order->isPaid()) {
            UnpaidOrderExtraCharge::dispatch($order);

            return;
        }

        ExtraChargeSuccessful::dispatch($order);
    }

    public function processRefund(
        Order $order,
        User $user,
        array $data,
        array $refundResponse,
        bool $refundedInWallet = false
    ): void {
        DB::transaction(function () use ($order, $user, $data, $refundResponse, $refundedInWallet) {
            $order->updateAfterRefund($data['amount']);

            $paymentMethodId = $refundedInWallet && $order->isPaid()
                ? PaymentMethod::getWalletPaymentMethod()->id
                : null;

            $order->createOrderPayment($refundResponse, $user, $paymentMethodId);
        });

        if (! $order->isPaid()) {
            UnpaidOrderRefund::dispatch($order);

            return;
        }

        RefundSuccessful::dispatch($order, $data);
    }
}
