import { AxiosRequestConfig } from 'axios';
import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listUserCardsAction } from '@shared/redux/slices/userCardsSlice';

export function useListUserCardsQuery(config?: AxiosRequestConfig) {
    return useListQuery(listUserCardsAction, UserCardEntity, (state) => state.userCards, config);
}
