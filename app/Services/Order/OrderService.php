<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;
use App\Http\Resources\API\Customer\Order\OrderPaymentResource;

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
            ->allowedFilters(['order_number'])
            ->allowedSorts(['grand_total'])
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getSubmissionConfirmationData(Order $order)
    {
        $data = [];

        $paymentPlan = $order->paymentPlan;
        $orderItems = $order->getGroupedOrderItems();
        $orderPayment = OrderPaymentResource::make($order->orderPayment)->resolve();

        $data["SUBMISSION_NUMBER"] = $order->order_number;
        $data["SHIPPING_INSTRUCTIONS_URL"] = config('app.url') . '/dashboard/submissions/' . $order->id . '/confirmation';

        $items = [];
        foreach($orderItems as $orderItem){
            $card = $orderItem->cardProduct;
            $items[] = [
                "CARD_IMAGE_URL" => $card->image_bucket_path,
                "CARD_NAME" => $card->name,
                "CARD_FULL_NAME" => $card->getSearchableName(),
                "CARD_VALUE" => $orderItem->declared_value_per_unit,
                "CARD_QUANTITY" => $orderItem->quantity,
                "CARD_COST" => $orderItem->quantity * $paymentPlan->price,
            ];
        }

        $data["ORDER_ITEMS"] = $items;
        $data["SUBTOTAL"] = $order->service_fee;
        $data["SHIPPING_FEE"] = $order->shipping_fee;
        $data["TOTAL"] = $order->grand_total;

        $data["SERVICE_LEVEL"] = $paymentPlan->price;
        $data["NUMBER_OF_CARDS"] = $orderItems->sum('quantity');
        $data["DATE"] = $order->created_at->format('m/d/Y');
        $data["TOTAL_DECLARED_VALUE"] = $order->orderItems->sum('declared_value_per_unit');

        $data["SHIPPING_ADDRESS"] = $this->getAddressData($order->shippingAddress);
        $data["BILLING_ADDRESS"] = $this->getAddressData($order->billingAddress);

        $data["ORDER_PAYMENT"] = $this->getOrderPaymentText($orderPayment);

        return $data;
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
        if(array_key_exists('card',$orderPayment))
        {
            return ucfirst($orderPayment["card"]["brand"]) . ' ending in ' . $orderPayment["card"]["last4"];
        }
        else if(array_key_exists('payer',$orderPayment))
        {
            return $orderPayment["payer"]["email"] . "\n" . $orderPayment["payer"]["name"];
        }

        return '';
    }
}
