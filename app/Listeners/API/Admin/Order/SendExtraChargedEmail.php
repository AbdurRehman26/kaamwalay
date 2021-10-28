<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Services\EmailService;

class SendExtraChargedEmail
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
     * @param  ExtraChargeSuccessful  $event
     * @return void
     */
    public function handle(ExtraChargeSuccessful $event)
    {
        $orderPayment = new OrderPaymentResource($event->order->lastOrderPayment);
        $order = $event->order;
        $user = $order->user;
        $card = $orderPayment->card;
        $this->emailService->sendEmail(
            [[ $user->email => $user->name ]],
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_SUBMISSION_EXTRA_CHARGED],
            $this->emailService::TEMPLATE_SLUG_SUBMISSION_EXTRA_CHARGED,
            [
                'ORDER_NUMBER' => $order->order_number,
                'TOTAL_AMOUNT' => number_format($order->grand_total, 2),
                'SUB_TOTAL' => number_format($order->service_fee, 2),
                'SHIPPING_FEE' => number_format($order->shipping_fee, 2),
                'EXTRA_CHARGE' => number_format($orderPayment->amount, 2),
                'CARD' => $card ? ($card['brand'] . ' ending in ' . $card['last4']) : 'N/A',
                'SUBMISSION_URL' => config('app.url') . '/dashboard/submissions/' . $order->id . '/view',
            ],
        );
    }
}
