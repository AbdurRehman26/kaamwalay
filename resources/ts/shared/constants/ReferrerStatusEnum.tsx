export enum ReferrerStatusEnum {
    INACTIVE = 0,
    ACTIVE,
}

type StatusColorProps = {
    primary: string;
    secondary: string;
};

export const ReferrerStatusMap = {
    [ReferrerStatusEnum.INACTIVE]: { label: 'Inactive', value: 'inactive' },
    [ReferrerStatusEnum.ACTIVE]: { label: 'Active', value: 'active' },
};

export const ReferrerStatusColorsMap: { [key in ReferrerStatusEnum]: StatusColorProps } = {
    [ReferrerStatusEnum.INACTIVE]: { primary: '#0000008A', secondary: 'rgba(221, 221, 221, 1)' },
    [ReferrerStatusEnum.ACTIVE]: { primary: '#388E3C', secondary: 'rgba(215, 232, 216, 1)' },
};
