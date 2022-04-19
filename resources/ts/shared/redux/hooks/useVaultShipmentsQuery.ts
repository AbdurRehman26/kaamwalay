import { AxiosRequestConfig } from 'axios';
import { VaultShipmentEntity } from '@shared/entities/VaultShipmentEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listVaultShipmentsAction } from '@shared/redux/slices/vaultShipmentsSlice';

export function useListVaultShipmentsQuery(config?: AxiosRequestConfig) {
    return useListQuery(listVaultShipmentsAction, VaultShipmentEntity, (state) => state.vaultShipments, config);
}
