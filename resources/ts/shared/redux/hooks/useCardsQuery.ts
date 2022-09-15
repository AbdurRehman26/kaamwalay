import { AxiosRequestConfig } from 'axios';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminCardsAction } from '../slices/adminCardsSlice';

export function useAdminCardQuery(config: AxiosRequestConfig) {
    return useListQuery(listAdminCardsAction, CardProductEntity, (state) => state.adminCards, config);
}
