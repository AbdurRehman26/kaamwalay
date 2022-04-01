export enum OrderStepsEnum {
    CARDS_SELECTION_STEP = 1,
    SHIPPING_DETAILS_STEP = 2,
    PROMO_DISCOUNT_STEP = 3,
    ORDER_REVIEW_STEP = 4,
}

export const OrderStepsMap = {
    cardsSelectionStep: OrderStepsEnum.CARDS_SELECTION_STEP,
    shippingDetailsStep: OrderStepsEnum.SHIPPING_DETAILS_STEP,
    promoDiscountStep: OrderStepsEnum.PROMO_DISCOUNT_STEP,
    orderReviewStep: OrderStepsEnum.ORDER_REVIEW_STEP,
};

export const OrderUpdateStepsMap = [
    'cardsSelectionStep',
    'shippingDetailsStep',
    'promoDiscountStep',
    'orderReviewStep',
];
