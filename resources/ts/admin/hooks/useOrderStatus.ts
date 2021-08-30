import { useMemo } from 'react';
import { StatusChipColor } from '@shared/components/StatusChip';

interface Options {
    isShipped?: boolean;
    isGraded?: boolean;
    isReviewed?: boolean;
}

export function useOrderStatus({
    isShipped,
    isGraded,
    isReviewed,
}: Options): [statusType: StatusChipColor, label: string] {
    return useMemo(() => {
        if (isShipped) {
            return ['shipped', 'Shipped'];
        }

        if (isGraded) {
            return ['graded', 'Graded'];
        }

        if (isReviewed) {
            return ['reviewed', 'Reviewed'];
        }

        return ['pending', 'Pending'];
    }, [isGraded, isReviewed, isShipped]);
}
