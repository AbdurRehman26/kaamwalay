export enum PayoutStatusEnum {
    PENDING = 0,
    PROCESSING,
    COMPLETED,
    FAILED,
}

export const PaymentStatusMap = {
    [PayoutStatusEnum.PENDING]: 'pending',
    [PayoutStatusEnum.PROCESSING]: 'processing',
    [PayoutStatusEnum.COMPLETED]: 'completed',
    [PayoutStatusEnum.FAILED]: 'failed',
};
