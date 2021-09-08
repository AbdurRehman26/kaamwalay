<?php

namespace App\Services\Order;

use App\Models\OrderItem;
use App\Models\UserCard;
use App\Models\UserCardCertificate;

class UserCardService
{
    public function createItemUserCard(OrderItem $item): UserCard
    {
        $userCard = new UserCard();
        $userCard->order_item_id = $item->id;
        $userCard->user_id = $item->order->user_id;
        $userCard->save();

        $this->createCertificate($userCard);

        return $userCard->fresh();
    }

    public function createCertificate(UserCard $userCard): UserCardCertificate
    {
        $certificate = new UserCardCertificate();
        $certificate->user_card_id = $userCard->id;
        $certificate->save();

        return $certificate;
    }
}
