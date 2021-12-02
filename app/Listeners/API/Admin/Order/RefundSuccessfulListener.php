<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\RefundSuccessful;
use App\Http\Resources\API\Admin\Order\OrderPaymentResource;
use App\Models\Order;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Arr;

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
        $paymentDetails = json_decode(json_encode($orderPayment), true);
        $paymentOptionInformation = $this->isPaymentMethodStripe($paymentDetails)
            ? $this->extractCardDetails($paymentDetails)
            : $this->extractPaypalDetails($event->order);

        $this->emailService->sendEmail(
            [[$user->email => $user->name]],
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_REFUNDED],
            $this->emailService::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_REFUNDED,
            [
                'ORDER_NUMBER' => $order->order_number,
                'REFUNDED_AMOUNT' => number_format($event->data['amount'], 2),
                'REFUNDED_AMOUNT_TOTAL' => number_format($order->refund_total, 2),
                'TOTAL_AMOUNT' => number_format($order->grand_total, 2),
                'SUB_TOTAL' => number_format($order->service_fee, 2),
                'SHIPPING_FEE' => number_format($order->shipping_fee, 2),
                'EXTRA_CHARGE_TOTAL' => $order->extra_charge_total ? '$' . number_format($order->extra_charge_total, 2) : 'N/A',
                'CARD' => $paymentOptionInformation,
                'NOTES' => $order->lastOrderPayment->notes,
                'SUBMISSION_URL' => config('app.url') . '/dashboard/submissions/' . $order->id . '/view',
            ],
        );
    }

    protected function extractCardDetails(array $paymentData): string
    {
        $card = $paymentData['card'];

        return $card['brand'] . ' ending in ' . $card['last4'];
    }

    protected function extractPaypalDetails(Order $order): string
    {
        $paypalPaymentData = json_decode($order->firstOrderPayment->response, associative: true);

        return 'Paypal Account: ' . $paypalPaymentData['payer']['email_address'] ?? "N/A";
    }

    protected function isPaymentMethodStripe(array $data): bool
    {
        return Arr::has($data, 'card');
    }
}
