<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use App\Models\User;
use App\Services\Payment\InvoiceService;
use Illuminate\Http\JsonResponse;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Exception\ApiErrorException;
use Symfony\Component\HttpFoundation\Response;

class StripeService implements PaymentProviderServiceInterface
{
    public function createSetupIntent(): \Stripe\SetupIntent
    {
        /** @var User $user */
        $user = auth()->user();

        return $user->createSetupIntent(['customer' => $user->stripe_id]);
    }

    public function charge(Order $order)
    {
        /** @var User $user */
        $user = auth()->user();

        $paymentData = [
            'amount' => $order->grand_total * 100,
            'payment_intent_id' => $order->orderPayment->payment_provider_reference_id,
            'additional_data' => [
                'description' => "Payment for Order # {$order->id}",
                'metadata' => [
                    'Order ID' => $order->id,
                    'User Email' => $order->user->email,
                ],
            ],
        ];

        try {
            $response = $user->charge(
                $paymentData['amount'],
                $paymentData['payment_intent_id'],
                $paymentData['additional_data']
            );

            $order->markAsPlaced();
            $order->orderPayment->update([
                'request' => json_encode($paymentData),
                'response' => json_encode($response->toArray()),
            ]);

            $this->createOrderInvoice($order);

            return new JsonResponse([
                'success' => true,
                'data' => $response,
            ], Response::HTTP_CREATED);
        } catch (IncompletePayment $exception) {
            return new JsonResponse([
                'payment_intent' => $exception->payment,
            ], Response::HTTP_PAYMENT_REQUIRED);
        }
    }

    public function verify(Order $order, string $paymentIntentId): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        try {
            $paymentIntent = $user->stripe()->paymentIntents->retrieve($paymentIntentId);
        } catch (ApiErrorException $e) {
            return new JsonResponse([
                'message' => 'Payment could not be verified.',
            ], Response::HTTP_BAD_REQUEST);
        }

        abort_if($paymentIntent->charges->count() === 0, Response::HTTP_UNPROCESSABLE_ENTITY);

        $charge = $paymentIntent->charges->first();
        if (
            $charge->amount == ($order->grand_total * 100)
            && $charge->outcome->type === 'authorized'
        ) {
            $order->markAsPlaced();

            $this->createOrderInvoice($order);

            return new JsonResponse([
                'message' => 'Payment verified successfully',
            ], Response::HTTP_OK);
        }

        return new JsonResponse([
            'message' => 'Payment could not be verified.',
        ], Response::HTTP_BAD_REQUEST);
    }

    protected function createOrderInvoice(Order $order)
    {
        (new InvoiceService())->saveInvoicePDF($order);
    }
}
