import { DateLike } from '@shared/lib/datetime/DateLike';

export interface StatusProgressStep {
    label: string;
    value: string;
    isCompleted?: boolean;
    completedAt?: DateLike;
}
