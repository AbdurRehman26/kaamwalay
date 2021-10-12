import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { useShowQuery } from '@shared/hooks/useShowQuery';
import { showUserCardAction } from '@shared/redux/slices/userCardsSlice';
import { ThunkShowActionArg } from '@shared/types/ThunkShowActionArg';

export function useUserCardQuery(options: ThunkShowActionArg) {
    return useShowQuery(showUserCardAction, UserCardEntity, (state) => state.userCards, options);
}
