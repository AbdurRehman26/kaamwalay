import { AxiosRequestConfig } from 'axios';
import { CardRarityEntity } from '@shared/entities/CardRarityEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminRaritiesAction } from '../slices/adminRaritiesSlice';

export function useAdminRaritiesQuery(config: AxiosRequestConfig) {
    return useListQuery(listAdminRaritiesAction, CardRarityEntity, (state) => state.adminRarities, config);
}
