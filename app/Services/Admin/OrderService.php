<?php

namespace App\Services\Admin;

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Events\API\Admin\Order\OrderUpdated;
use App\Events\API\Admin\Order\RefundSuccessful;
use App\Events\API\Admin\OrderItem\OrderItemCardChangedEvent;
use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Exceptions\API\Admin\Order\FailedExtraCharge;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Http\Resources\API\Services\AGS\CardGradeResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use App\Services\Admin\Order\OrderItemService;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class OrderService
{
    public function __construct(
        private OrderItemService $orderItemService,
        private AgsService $agsService
    ) {
    }

    public function getOrders(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::class)
            ->allowedFilters(Order::getAllowedAdminFilters())
            ->allowedIncludes(Order::getAllowedAdminIncludes())
            ->allowedSorts(['grand_total'])
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $orderId): Model | QueryBuilder
    {
        return QueryBuilder::for(Order::class)
            ->allowedIncludes(Order::getAllowedAdminIncludes())
            ->findOrFail($orderId);
    }

    public function getOrderCertificates(Order|int $order): array
    {
        $certificates = UserCard::select('certificate_number')
        ->join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
        ->where('order_items.order_id', getModelId($order))->get();

        return $certificates->pluck('certificate_number')->flatten()->all();
    }

    protected function getCertificatesDataQuery(): Builder
    {
        return UserCard::select([
            'certificate_number as certificate_id',
            'card_sets.name as set_name',
            'card_products.card_number',
            'card_products.edition',
            'card_products.surface',
            'card_products.variant',
            'card_products.card_reference_id',
        ])
        ->join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
        ->join('card_products', 'order_items.card_product_id', '=', 'card_products.id')
        ->join('card_sets', 'card_products.card_set_id', '=', 'card_sets.id');
    }

    public function getOrderCertificatesData(Order|int $order): array
    {
        return $this->getCertificatesDataQuery()
            ->where('order_items.order_id', getModelId($order))
            ->get()->toArray();
    }

    public function getOrderItemCertificateData(OrderItem|int $orderItem): array
    {
        return $this->getCertificatesDataQuery()
            ->where('user_cards.order_item_id', getModelId($orderItem))
            ->get()->toArray();
    }

    public function addExtraCard(Order $order, User $user, int $card_id, float $value): OrderItem
    {
        $newItem = OrderItem::create([
            'order_id' => $order->id,
            'card_product_id' => $card_id,
            'quantity' => 1,
            'declared_value_per_unit' => $value,
            'declared_value_total' => $value,
        ]);

        return $this->orderItemService->changeStatus($order, $newItem, ["status" => "confirmed"], $user);
    }

    public function editCard(Order $order, OrderItem $orderItem, int $card_id, float $value): OrderItem
    {
        if ($orderItem->order_id !== $order->id) {
            throw new OrderItemDoesNotBelongToOrder;
        }

        $previousCardProduct = $orderItem->cardProduct;

        $orderItem->card_product_id = $card_id;
        $orderItem->declared_value_per_unit = $value;
        $orderItem->declared_value_total = $value;
        $orderItem->save();

        $this->updateAgsCertificateCard($orderItem);

        OrderItemCardChangedEvent::dispatch($orderItem, $previousCardProduct);

        return $orderItem->fresh();
    }

    public function updateNotes(Order $order, $notes): Order
    {
        $order->notes = $notes;
        $order->save();

        OrderUpdated::dispatch($order);

        return $order;
    }

    /**
     * @throws IncorrectOrderStatus
     */
    public function getGrades(Order $order): Collection
    {
        if (! in_array($order->order_status_id, [OrderStatus::ARRIVED, OrderStatus::GRADED, OrderStatus::SHIPPED])) {
            throw new IncorrectOrderStatus;
        }
        $grades = $this->agsService->getGrades($this->getOrderCertificates($order));

        $cards = UserCard::join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
            ->where('order_items.order_id', $order->id)->select('user_cards.*')->get();

        $this->updateLocalGrades($grades['results'] ?? [], $cards);

        return $cards;
    }

    protected function updateLocalGrades(array $grades, Collection $cards): void
    {
        foreach ($grades as $result) {
            $certId = $result['certificate_id'];

            $card = $cards->first(function ($c, $key) use ($certId) {
                return $c->certificate_number === $certId;
            });

            if (! is_null($card)) {
                $card->update(CardGradeResource::make($result)->ignoreParams('overall')->toArray(request()));
            }
        }
    }

    public function getDataForAdminSubmissionConfirmationEmail(Order $order): array
    {
        $data = [];

        $paymentPlan = $order->paymentPlan;
        $orderItems = $order->getGroupedOrderItems();
        $orderPayment = OrderPaymentResource::make($order->firstOrderPayment)->resolve();

        $data["SUBMISSION_NUMBER"] = $order->order_number;
        $data['CUSTOMER_NAME'] = $order->user->getFullName();
        $data['CUSTOMER_EMAIL'] = $order->user->email;
        $data['CUSTOMER_NUMBER'] = $order->user->customer_number;
        $data["TIME"] = $order->created_at->format('h:m A');

        $items = [];
        foreach ($orderItems as $orderItem) {
            $card = $orderItem->cardProduct;
            $items[] = [
                "CARD_IMAGE_URL" => $card->image_path,
                "CARD_NAME" => $card->name,
                "CARD_FULL_NAME" => $card->getSearchableName(),
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

    /**
     * @throws FailedExtraCharge|Throwable
     */
    public function addExtraCharge(Order $order, User $user, array $data, array $paymentResponse): void
    {
        DB::transaction(function () use ($order, $user, $data, $paymentResponse) {
            $order->updateAfterExtraCharge($data['amount']);

            $order->createOrderPayment($paymentResponse, $user);
        });

        ExtraChargeSuccessful::dispatch($order);
    }

    protected function updateAgsCertificateCard(OrderItem $orderItem): array
    {
        $data = $this->getOrderItemCertificateData($orderItem);

        return $this->agsService->createCertificates($data);
    }

    public function processRefund(Order $order, User $user, array $data, array $refundResponse): void
    {
        DB::transaction(function () use ($order, $user, $data, $refundResponse) {
            $order->updateAfterRefund($data['amount']);

            $order->createOrderPayment($refundResponse, $user);
        });

        RefundSuccessful::dispatch($order, $data);
    }
}
