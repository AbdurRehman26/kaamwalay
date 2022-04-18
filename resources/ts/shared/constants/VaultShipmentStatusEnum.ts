export enum VaultShipmentStatusEnum {
    PENDING = 1,
    SHIPPED = 2,
}

export const VaultShipmentStatusMap = {
    [VaultShipmentStatusEnum.PENDING]: 'pending',
    [VaultShipmentStatusEnum.SHIPPED]: 'shipped',
};

type StatusColorProps = {
    primary: string;
    secondary: string;
};

export const VaultShipmentStatusColorsMap: { [key in VaultShipmentStatusEnum]: StatusColorProps } = {
    [VaultShipmentStatusEnum.PENDING]: { primary: '#000000', secondary: 'rgba(0, 0, 0, 0.12)' },
    [VaultShipmentStatusEnum.SHIPPED]: { primary: '#20A926', secondary: 'rgba(32, 169, 38, 0.12)' },
};
