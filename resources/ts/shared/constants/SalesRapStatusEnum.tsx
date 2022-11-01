export enum SalesRapStatusEnum {
    INACTIVE = 0,
    ACTIVE,
}

type StatusColorProps = {
    primary: string;
    secondary: string;
};

export const SalesRapStatusMap = {
    [SalesRapStatusEnum.INACTIVE]: { label: 'Inactive', value: 'inactive' },
    [SalesRapStatusEnum.ACTIVE]: { label: 'Active', value: 'active' },
};

export const SalesRapStatusColorsMap: { [key in SalesRapStatusEnum]: StatusColorProps } = {
    [SalesRapStatusEnum.INACTIVE]: { primary: '#0000008A', secondary: 'rgba(221, 221, 221, 1)' },
    [SalesRapStatusEnum.ACTIVE]: { primary: '#388E3C', secondary: 'rgba(215, 232, 216, 1)' },
};
