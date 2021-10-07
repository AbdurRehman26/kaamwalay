<?php

namespace App\Services\Order;

use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\UserCard;
use App\Models\UserCardCertificate;
use App\Services\Admin\CardGradingService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

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

        $certificateNumber = Str::padLeft($certificate->id, 8, '0');
        $certificate->number = $certificateNumber;
        $certificate->save();

        $userCard->certificate_number = $certificateNumber;
        $userCard->save();

        return $certificate;
    }

    public function getFeedCards(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return UserCard::join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
        ->join('orders', 'orders.id', '=', 'order_items.order_id')
        ->join('order_item_status_histories', 'order_item_status_histories.order_item_id', '=', 'order_items.id')
        ->whereIn('order_item_status_histories.order_item_status_id', [OrderItemStatus::GRADED])
        ->whereIn('orders.order_status_id', [OrderStatus::GRADED,OrderStatus::SHIPPED])
        ->whereIn('order_items.order_item_status_id', [OrderItemStatus::GRADED])
        ->select(['user_cards.*','order_item_status_histories.created_at as graded_at'])
        ->orderBy('reviewed_at', 'desc')
        ->paginate($itemsPerPage);
    }
}
