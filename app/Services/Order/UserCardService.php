<?php

namespace App\Services\Order;

use App\Models\OrderItem;
use App\Models\UserCard;
use App\Models\UserCardCertificate;
use App\Services\Admin\CardGradingService;
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
}
