import { UserEntity } from '@shared/entities/UserEntity';

export function pushDataToRefersion(order: any, user$: UserEntity) {
    const orderNumber = order.orderNumber;
    const shippingFee = order.step02Data.shippingFee;
    const discountedValue = order.couponState.appliedCouponData.discountedAmount;
    const couponCode = order.couponState.couponCode;

    const turnAround = order.step01Data.selectedServiceLevel.turnaround;
    const maxProtection = order.step01Data.selectedServiceLevel.maxProtectionAmount;
    const serviceLevelPrice = order.step01Data?.selectedServiceLevel.price;
    const selectedCards = order.step02Data.selectedCards;

    const numberOfSelectedCards =
        selectedCards.length !== 0
            ? selectedCards.reduce(function (prev: number, cur: any) {
                  // @ts-ignore
                  return prev + cur?.qty;
              }, 0)
            : 0;

    console.log('push to refersion');
    // @ts-ignore
    window._refersion(function () {
        console.log('push to refersion inside');
        // @ts-ignore
        window._rfsn._addTrans({
            // eslint-disable-next-line camelcase
            order_id: orderNumber,
            shipping: shippingFee,
            discount: discountedValue,
            // eslint-disable-next-line camelcase
            discount_code: couponCode,
            // eslint-disable-next-line camelcase
            currency_code: 'USD',
        });

        // @ts-ignore
        window._rfsn._addCustomer({
            // eslint-disable-next-line camelcase
            first_name: user$.firstName,
            // eslint-disable-next-line camelcase
            last_name: user$.lastName,
            email: user$.email,
        });

        // @ts-ignore
        window._rfsn._addItem({
            sku: `${turnAround} turnaround with $${maxProtection} insurance`,
            quantity: String(numberOfSelectedCards),
            price: String(serviceLevelPrice),
        });
        // @ts-ignore
        window._rfsn._sendConversion();
    });
}
