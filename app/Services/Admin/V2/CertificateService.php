<?php

namespace App\Services\Admin\V2;

use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\UserCard;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class CertificateService
{
    protected const DEFAULT_PAGE_SIZE = 10;

    public function getCertificates(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?? self::DEFAULT_PAGE_SIZE;

        $query = UserCard::join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.order_status_id', OrderStatus::SHIPPED)
            ->where('order_items.order_item_status_id', OrderItemStatus::GRADED)
            ->select(['user_cards.*']);

        return QueryBuilder::for($query)
            ->allowedSorts(['created_at'])
            ->defaultSort('-user_cards.created_at')
            ->paginate($itemsPerPage);
    }

    public function getCertificate(string $certificateId): Model | QueryBuilder
    {
        $query = UserCard::where('certificate_number', $certificateId);

        return QueryBuilder::for($query)
            ->firstOrFail();
    }
}
