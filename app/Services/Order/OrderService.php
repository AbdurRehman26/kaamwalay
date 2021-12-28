<?php

namespace App\Services\Order;

use App\Http\Resources\API\V1\Customer\Order\OrderPaymentResource;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService
{
    public function getOrders(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::class)
            ->placed()
            ->forUser($user)
            ->allowedIncludes(Order::getAllowedIncludes())
            ->allowedFilters(Order::getAllowedFilters())
            ->allowedSorts(['grand_total'])
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $orderId): Model
    {
        return QueryBuilder::for(Order::class)
            ->allowedIncludes(Order::getAllowedIncludes())
            ->findOrFail($orderId);
    }

    public function getDataForCustomerSubmissionConfirmationEmail(Order $order): array
    {
        $data = [];

        $paymentPlan = $order->paymentPlan;
        $orderItems = $order->getGroupedOrderItems();
        $orderPayment = OrderPaymentResource::make($order->firstOrderPayment)->resolve();

        $data["SUBMISSION_NUMBER"] = $order->order_number;
        $data["SHIPPING_INSTRUCTIONS_URL"] = config('app.url') . '/dashboard/submissions/' . $order->id . '/confirmation';

        $items = [];
        foreach ($orderItems as $orderItem) {
            $card = $orderItem->cardProduct;
            $items[] = [
                "CARD_IMAGE_URL" => $card->image_path,
                "CARD_NAME" => $card->name,
                "CARD_FULL_NAME" => $this->getCardFullName($card),
                "CARD_VALUE" => number_format($orderItem->declared_value_per_unit, 2),
                "CARD_QUANTITY" => $orderItem->quantity,
                "CARD_COST" => number_format($orderItem->quantity * $paymentPlan->price, 2),
            ];
        }

        $data["ORDER_ITEMS"] = $items;
        $data["SUBTOTAL"] = number_format($order->service_fee, 2);
        $data["SHIPPING_FEE"] = number_format($order->shipping_fee, 2);
        $data["TOTAL"] = number_format($order->grand_total, 2);

        $data["SERVICE_LEVEL"] = $paymentPlan->price;
        $data["NUMBER_OF_CARDS"] = $orderItems->sum('quantity');
        $data["DATE"] = $order->created_at->format('m/d/Y');
        $data["TOTAL_DECLARED_VALUE"] = number_format($order->orderItems->sum('declared_value_per_unit'), 2);

        $data["SHIPPING_ADDRESS"] = $this->getAddressData($order->shippingAddress);
        $data["BILLING_ADDRESS"] = $this->getAddressData($order->billingAddress);

        $data["PAYMENT_METHOD"] = $this->getOrderPaymentText($orderPayment);

        return $data;
    }

    protected function getCardFullName(CardProduct $card): string
    {
        return $card->isCardInformationComplete() ? $card->getSearchableName() : $card->name . ' (Added Manually)';
    }

    protected function getAddressData($address): array
    {
        return [
            "ID" => $address->id,
            "FULL_NAME" => $address->first_name . " " . $address->last_name,
            "ADDRESS" => $address->address,
            "CITY" => $address->city,
            "STATE" => $address->state,
            "ZIP" => $address->zip,
            "COUNTRY" => $address->country->code,
            "PHONE" => $address->phone,
        ];
    }

    protected function getOrderPaymentText(array $orderPayment): string
    {
        if (array_key_exists('card', $orderPayment)) {
            return ucfirst($orderPayment["card"]["brand"]) . ' ending in ' . $orderPayment["card"]["last4"];
        } elseif (array_key_exists('payer', $orderPayment)) {
            return $orderPayment["payer"]["email"] . "\n" . $orderPayment["payer"]["name"];
        }

        return '';
    }
}
