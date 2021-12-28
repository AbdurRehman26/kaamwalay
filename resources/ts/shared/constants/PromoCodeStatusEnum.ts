export enum PromoCodeStatusEnum {
    active = 'active',
    queued = 'queued',
    inactive = 'inactive',
}

export const PromoCodeStatusMap = {
    [PromoCodeStatusEnum.active]: { label: 'Active', value: 'active' },
    [PromoCodeStatusEnum.queued]: { label: 'Queued', value: 'queued' },
    [PromoCodeStatusEnum.inactive]: { label: 'Inactive', value: 'inactive' },
};
