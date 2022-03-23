export enum PaymentStatusEnum {
    PENDING = 0,
    DUE,
    PAID,
}

export const PaymentStatusMap = {
    [PaymentStatusEnum.PENDING]: 'pending',
    [PaymentStatusEnum.DUE]: 'payment due',
    [PaymentStatusEnum.PAID]: 'paid',
};

type StatusColorProps = {
    primary: string;
    secondary: string;
};

export const PaymentStatusColorsMap: { [key in PaymentStatusEnum]: StatusColorProps } = {
    [PaymentStatusEnum.PENDING]: { primary: '#DA6612', secondary: 'rgba(218, 102, 18, 0.12)' },
    [PaymentStatusEnum.DUE]: { primary: '#BE1A1A', secondary: 'rgba(190, 26, 26, 0.12)' },
    [PaymentStatusEnum.PAID]: { primary: '#20A926', secondary: 'rgba(32, 169, 38, 0.12)' },
};

export const PaymentNoticeHeadingMap = {
    [PaymentStatusEnum.PENDING]: 'Payment Pending',
    [PaymentStatusEnum.DUE]: 'Payment Due',
    [PaymentStatusEnum.PAID]: 'Payment Paid',
};

export const PaymentNoticeTextMap = {
    [PaymentStatusEnum.PENDING]:
        "You can now pay whenever you like. Just keep in mind we can't ship your cards back till you have completed payment.",
    [PaymentStatusEnum.DUE]:
        'This order has not been paid for yet. We can not ship your slabbed cards back to you until you complete payment. Please click PAY NOW to submit your payment for this order.',
    [PaymentStatusEnum.PAID]: 'Payment Paid',
};
