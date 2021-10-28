<?php

namespace App\Services\Order;

use App\Http\Filters\UserCardSearchFilter;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use App\Models\UserCardCertificate;
use App\Services\Admin\CardGradingService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class UserCardService
{
    public function createItemUserCard(OrderItem $item): UserCard
    {
        $cardGradingService = new CardGradingService;
        $userCard = new UserCard();
        $userCard->order_item_id = $item->id;
        $userCard->user_id = $item->order->user_id;
        $userCard->human_grade_values = $cardGradingService->defaultValues('human');
        $userCard->robo_grade_values = $cardGradingService->defaultValues('robo');
        $userCard->overall_values = $cardGradingService->defaultValues('overall');
        $userCard->overall_grade = 0.0;
        $userCard->generated_images = $cardGradingService->defaultValues('images');
        $userCard->save();

        $this->createCertificate($userCard);

        return $userCard->fresh();
    }

    public function createCertificate(UserCard $userCard): UserCardCertificate
    {
        $certificate = new UserCardCertificate();
        $certificate->user_card_id = $userCard->id;
        $certificate->save();

        $certificateNumber = Str::padLeft((string) $certificate->id, 8, '0');
        $certificate->number = $certificateNumber;
        $certificate->save();

        $userCard->certificate_number = $certificateNumber;
        $userCard->save();

        return $certificate;
    }

    public function getFeedCards(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return UserCard::with(['orderItem.cardProduct.cardSet.cardSeries', 'orderItem.cardProduct.cardCategory', 'user'])
        ->join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
        ->join('orders', 'orders.id', '=', 'order_items.order_id')
        ->join('order_item_status_histories', 'order_item_status_histories.order_item_id', '=', 'order_items.id')
        ->whereIn('order_item_status_histories.order_item_status_id', [OrderItemStatus::GRADED])
        ->whereIn('orders.order_status_id', [OrderStatus::GRADED,OrderStatus::SHIPPED])
        ->whereIn('order_items.order_item_status_id', [OrderItemStatus::GRADED])
        ->select(['user_cards.*','order_item_status_histories.created_at as graded_at'])
        ->orderBy('reviewed_at', 'desc')
        ->paginate($itemsPerPage);
    }
    public function getCustomerCards(User $user): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        $query = UserCard::with(['orderItem.cardProduct.cardSet.cardSeries', 'orderItem.cardProduct.cardCategory'])
        ->join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
        ->join('orders', 'orders.id', '=', 'order_items.order_id')
        ->join('card_products', 'card_products.id', '=', 'order_items.card_product_id')
        ->join('order_item_status_histories', 'order_item_status_histories.order_item_id', '=', 'order_items.id')
        ->where('user_cards.user_id', $user->id)
        ->where('order_item_status_histories.order_item_status_id', OrderItemStatus::GRADED)
        ->whereIn('orders.order_status_id', [OrderStatus::GRADED,OrderStatus::SHIPPED])
        ->where('order_items.order_item_status_id', OrderItemStatus::GRADED)
        ->select(['user_cards.*']);

        return QueryBuilder::for($query)
        ->allowedFilters([
            AllowedFilter::custom('search', new UserCardSearchFilter),
        ])
        ->allowedSorts([
            AllowedSort::field('name', 'card_products.name'),
            AllowedSort::field('date', 'order_item_status_histories.created_at'),
        ])
        ->defaultSort('-order_item_status_histories.created_at')
        ->paginate($itemsPerPage);
    }
}
