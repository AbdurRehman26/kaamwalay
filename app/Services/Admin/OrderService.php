<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\UserCardCertificate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService
{
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
}
