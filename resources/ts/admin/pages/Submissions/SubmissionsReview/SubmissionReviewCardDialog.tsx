import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { plainToClass } from 'class-transformer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReviewCardDialog, ReviewCardDialogProps } from '@shared/components/ReviewCardDialog';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useAppSelector } from '@admin/redux/hooks';

interface SubmissionReviewCardDialogProps extends Omit<ReviewCardDialogProps, 'children'> {
    indexId: number;
    orderId: number;
    itemsLength: number;
    disableNext?: boolean;
    disablePrevious?: boolean;

    onNext(): void;
    onPrevious(): void;
    onMissing(value: number): void;
    onEdit(value: number): void;
    onConfirm(value: number): void;
}

export function SubmissionReviewCardDialog(props: SubmissionReviewCardDialogProps) {
    const { indexId, orderId, itemsLength, onClose, onConfirm, onEdit, onNext, onMissing, ...rest } = props;

    const notification = useNotifications();
    const entities = useAppSelector((state) => state.adminOrders.entities);
    const [loading, setLoading] = useState('');
    const order = useMemo(() => plainToClass(OrderEntity, entities[orderId]), [entities, orderId]);
    const activeItem = useMemo(() => (order?.orderItems ?? [])[indexId], [order?.orderItems, indexId]);

    const handleClose = useCallback(() => (onClose as any)(), [onClose]);

    const handleConfirm = useCallback(async () => {
        setLoading('confirm');
        try {
            await onConfirm(activeItem?.id);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');
        onNext && onNext();
    }, [onNext, onConfirm, activeItem?.id, notification]);

    const handleMissing = useCallback(async () => {
        setLoading('missing');
        try {
            await onMissing(activeItem?.id);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');
        onNext && onNext();
    }, [onNext, onMissing, activeItem?.id, notification]);

    const handleEdit = useCallback(async () => {
        setLoading('missing');
        try {
            await onEdit(activeItem?.id);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');
        onNext && onNext();
    }, [onNext, onEdit, activeItem?.id, notification]);

    useEffect(
        () => {
            if (rest.open && itemsLength === 0) {
                handleClose();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [itemsLength, rest.open],
    );

    return (
        <ReviewCardDialog itemsLength={itemsLength} onNext={onNext} {...rest}>
            <Grid item container spacing={2} xs>
                <Grid item xs>
                    <Button
                        variant={'contained'}
                        size={'large'}
                        fullWidth
                        onClick={handleMissing}
                        disabled={loading !== ''}
                        startIcon={loading === 'missing' ? <CircularProgress size={24} color={'inherit'} /> : null}
                    >
                        Missing
                    </Button>
                </Grid>
                <Grid item xs>
                    <Button
                        variant={'contained'}
                        size={'large'}
                        fullWidth
                        onClick={handleEdit}
                        disabled={loading !== ''}
                        startIcon={loading === 'missing' ? <CircularProgress size={24} color={'inherit'} /> : null}
                    >
                        Edit
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs>
                <Button
                    color={'primary'}
                    variant={'contained'}
                    size={'large'}
                    fullWidth
                    onClick={handleConfirm}
                    disabled={loading !== ''}
                    startIcon={loading === 'confirm' ? <CircularProgress size={24} color={'inherit'} /> : null}
                >
                    Confirm
                </Button>
            </Grid>
        </ReviewCardDialog>
    );
}
