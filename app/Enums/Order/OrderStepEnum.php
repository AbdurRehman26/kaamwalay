<?php

namespace App\Enums\Order;

enum OrderStepEnum: string
{
    case CARDS_SELECTION_STEP = 'cardsSelectionStep';
    case SHIPPING_DETAILS_STEP = 'shippingDetailsStep';
    case PROMO_DISCOUNT_STEP = 'promoDiscountStep';
    case ORDER_REVIEW_STEP = 'orderReviewStep';
    case ORDER_SUBMITTED_STEP = 'orderSubmittedStep';

    public function toString(): string
    {
        return match ($this) {
            self::CARDS_SELECTION_STEP => 'cardsSelectionStep',
            self::SHIPPING_DETAILS_STEP => 'shippingDetailsStep',
            self::PROMO_DISCOUNT_STEP => 'promoDiscountStep',
            self::ORDER_REVIEW_STEP => 'orderReviewStep',
            self::ORDER_SUBMITTED_STEP => 'orderSubmittedStep',
        };
    }
}
