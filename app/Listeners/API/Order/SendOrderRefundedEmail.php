<?php

namespace App\Listeners\API\Order;

use App\Events\API\Customer\Order\OrderRefunded;
use App\Http\Resources\API\Admin\Order\OrderPaymentResource;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class SendOrderRefundedEmail implements ShouldBeEncrypted
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected EmailService $emailService)
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  OrderRefunded  $event
     * @return void
     */
    public function handle(OrderRefunded $event)
    {
        $user = $event->order->user;
        $order = $event->order;
        $orderPayment = new OrderPaymentResource($event->order->firstOrderPayment);
        $card = $orderPayment->card;

        $this->emailService->sendEmail(
            [[ $user->email => $user->name ]],
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_ORDER_REFUNDED],
            $this->emailService::TEMPLATE_SLUG_ORDER_REFUNDED,
            [
                'ORDER_NUMBER' => $order->order_number,
                'REFUNDED_AMOUNT' => $event->data['amount'],
                'TOTAL_AMOUNT' => number_format($order->grand_total, 2),
                'SUB_TOTAL' => number_format($order->service_fee, 2),
                'SHIPPING_FEE' => number_format($order->shipping_fee, 2),
                'EXTRA_CHARGE' => number_format($orderPayment->amount, 2),
                'CARD' => $card ? ($card['brand'] . ' ending in ' . $card['last4']) : 'N/A',
                'NOTES' => $order->notes,
                'SUBMISSION_URL' => config('app.url') . '/dashboard/submissions/' . $order->id . '/view',
            ],
        );
    }
}
