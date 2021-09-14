<?php

namespace App\Services\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserCardCertificate;
use App\Services\AGS\AgsService;

class ManageOrderService
{
    public function __construct(
        private  OrderItemService $orderItemService,
        private AgsService $agsService)
    {
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
        $certificates = UserCardCertificate::select('number')
        ->join('user_cards', 'user_card_certificates.user_card_id', '=', 'user_cards.id')
        ->join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
        ->where('order_items.order_id', $order->id)->get();

        $certificateIds = implode(',', $certificates->pluck('number')->flatten()->all());

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
}
