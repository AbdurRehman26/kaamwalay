export enum PayoutStatusEnum {
    PENDING = 1,
    PROCESSING = 2,
    COMPLETED = 3,
    FAILED = 4,
}

export const PaymentStatusMap = {
    [PayoutStatusEnum.PENDING]: { label: 'Pending', value: 'pending' },
    [PayoutStatusEnum.PROCESSING]: { label: 'Processing', value: 'processing' },
    [PayoutStatusEnum.COMPLETED]: { label: 'Completed', value: 'completed' },
    [PayoutStatusEnum.FAILED]: { label: 'Failed', value: 'failed' },
};
