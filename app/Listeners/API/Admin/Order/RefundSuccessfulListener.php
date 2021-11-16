<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\RefundSuccessful;
use App\Http\Resources\API\Admin\Order\OrderPaymentResource;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class RefundSuccessfulListener implements ShouldQueue
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
     * @param  RefundSuccessful  $event
     * @return void
     */
    public function handle(RefundSuccessful $event)
    {
        $user = $event->order->user;
        $order = $event->order;
        $orderPayment = new OrderPaymentResource($event->order->firstOrderPayment);
        $card = json_decode(json_encode($orderPayment), true)['card'];

        $this->emailService->sendEmail(
            [[$user->email => $user->name]],
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_REFUNDED],
            $this->emailService::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_REFUNDED,
            [
                'ORDER_NUMBER' => $order->order_number,
                'REFUNDED_AMOUNT' => $event->data['amount'],
                'TOTAL_AMOUNT' => number_format($order->grand_total, 2),
                'SUB_TOTAL' => number_format($order->service_fee, 2),
                'SHIPPING_FEE' => number_format($order->shipping_fee, 2),
                'CARD' => $card ? ($card['brand'] . ' ending in ' . $card['last4']) : 'N/A',
                'NOTES' => $order->lastOrderPayment->notes,
                'SUBMISSION_URL' => config('app.url') . '/dashboard/submissions/' . $order->id . '/view',
            ],
        );
    }
}
