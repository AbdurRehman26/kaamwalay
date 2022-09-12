import { CardLabelEntity } from '../../entities/CardLabelEntity';
import { useShowQuery } from '../../hooks/useShowQuery';
import { ThunkShowActionArg } from '../../types/ThunkShowActionArg';
import { showAdminOrderLabelAction } from '../slices/adminOrderLabelsSlice';

export function useAdminOrderLabelQuery(options: ThunkShowActionArg) {
    return useShowQuery(showAdminOrderLabelAction, CardLabelEntity, (state) => state.adminOrderLabels, options);
}
