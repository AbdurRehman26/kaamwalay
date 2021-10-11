<?php

namespace App\Services\Admin;

use App\Events\API\Admin\Order\ExtraChargeApplied;
use App\Events\API\Admin\Order\OrderUpdated;
use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Http\Resources\API\Services\AGS\CardGradeResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use App\Services\Admin\Order\OrderItemService;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService
{
    public function __construct(
        private  OrderItemService $orderItemService,
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

    public function getOrderCertificatesData(Order|int $order): array
    {
        return UserCard::
            select('certificate_number as certificate_id', 'card_sets.name as set_name', 'card_products.card_number')
            ->join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
            ->join('card_products', 'order_items.card_product_id', '=', 'card_products.id')
            ->join('card_sets', 'card_products.card_set_id', '=', 'card_sets.id')
            ->where('order_items.order_id', getModelId($order))
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

        $orderItem->card_product_id = $card_id;
        $orderItem->declared_value_per_unit = $value;
        $orderItem->declared_value_total = $value;
        $orderItem->save();

        return $orderItem;
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
        if ($order->order_status_id !== OrderStatus::ARRIVED) {
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

    public function addExtraCharge(Order $order, array $data): void
    {
        $orderPayment = new OrderPayment(attributes: $data);

        $order->orderPayments()->save($orderPayment);

        $orderPaymentResource = new OrderPaymentResource($orderPayment);

        ExtraChargeApplied::dispatch($orderPaymentResource);
    }
}
