export enum PromoCodeStatusEnum {
    ACTIVE = 'active',
    QUEUED = 'queued',
    INACTIVE = 'inactive',
}

export const PromoCodeStatusMap = {
    [PromoCodeStatusEnum.ACTIVE]: { label: 'Active', value: 'active' },
    [PromoCodeStatusEnum.QUEUED]: { label: 'Queued', value: 'queued' },
    [PromoCodeStatusEnum.INACTIVE]: { label: 'Inactive', value: 'inactive' },
};
