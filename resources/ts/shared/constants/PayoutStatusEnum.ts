export enum PayoutStatusEnum {
    PENDING = 0,
    PROCESSING,
    COMPLETED,
    FAILED,
}

export const PaymentStatusMap = {
    [PayoutStatusEnum.PENDING]: { label: 'Pending', value: 'pending' },
    [PayoutStatusEnum.PROCESSING]: { label: 'Processing', value: 'processing' },
    [PayoutStatusEnum.COMPLETED]: { label: 'Completed', value: 'completed' },
    [PayoutStatusEnum.FAILED]: { label: 'Failed', value: 'failed' },
};
