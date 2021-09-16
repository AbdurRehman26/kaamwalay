<?php

namespace App\Services\Admin;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Http\Resources\API\Services\AGS\CardGradeResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use App\Models\UserCardCertificate;
use App\Services\Admin\Order\OrderItemService;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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
            ->where('id', $orderId)
            ->allowedIncludes(Order::getAllowedAdminIncludes())
            ->firstOrFail();
    }

    public function getOrderCertificates(Order|int $order): array
    {
        $certificates = UserCardCertificate::select('number')
        ->join('user_cards', 'user_card_certificates.user_card_id', '=', 'user_cards.id')
        ->join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
        ->where('order_items.order_id', getModelId($order))->get();

        return $certificates->pluck('number')->flatten()->all();
    }
    public function confirmReview(Order $order, User $user): Order
    {
        $order->order_status_id = 3;
        $order->reviewed_by_id = $user->id;
        $order->reviewed_at = new \Datetime();
        $order->save();

        $this->createCertificates($order);

        return $order;
    }

    public function createCertificates(Order $order)
    {
        $certificateIds = implode(',', $this->getOrderCertificates($order));

        return $this->agsService->createCertificates($certificateIds);
    }

    public function addExtraCard(Order $order, int $card_id, float $value): OrderItem
    {
        $newItem = OrderItem::create([
            'order_id' => $order->id,
            'card_product_id' => $card_id,
            'quantity' => 1,
            'declared_value_per_unit' => $value,
            'declared_value_total' => $value,
        ]);

        return $this->orderItemService->changeStatus($order, $newItem, ["status" => "confirmed"]);
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

    public function getGrades(Order $order)
    {
        if ($order->order_status_id !== OrderStatus::ARRIVED) {
            throw new IncorrectOrderStatus;
        }
        $grades = $this->agsService->getGrades($this->getOrderCertificates($order));
        $data = $this->updateLocalGrades($grades);

        return $data;
    }

    protected function updateLocalGrades(array $grades): array
    {
        $cards = [];
        foreach ($grades['results'] as $result) {
            $card = UserCard::whereCertificateNumber($result['certificate_id'])->first();
            if (! is_null($card)) {
                $card->update(CardGradeResource::make($result)->ignoreParams('overall')->toArray(request()));
                $cards[] = $card;
            }
        }

        return $cards;
    }
}
