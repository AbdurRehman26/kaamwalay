export enum OrderStepsEnum {
    ADD_CARDS = 1,
    ADD_SHIPPING = 2,
    ADD_PROMO_DISCOUNT = 3,
}

export const OrderStepsMap = {
    addCards: OrderStepsEnum.ADD_CARDS,
    addShipping: OrderStepsEnum.ADD_SHIPPING,
    addPromoDiscount: OrderStepsEnum.ADD_PROMO_DISCOUNT,
};
