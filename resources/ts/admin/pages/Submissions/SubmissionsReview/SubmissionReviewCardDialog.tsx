import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { plainToClass } from 'class-transformer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReviewCardDialog, ReviewCardDialogProps } from '@shared/components/ReviewCardDialog';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useAppSelector } from '@admin/redux/hooks';

interface SubmissionReviewCardDialogProps
    extends Omit<ReviewCardDialogProps, 'children' | 'onNext' | 'onPrevious' | 'itemsLength'> {
    itemId: number;
    orderId: number;
    disableNext?: boolean;
    disablePrevious?: boolean;
    onChangeItemId(value?: number | null): void;
    onMissing(value: number): void;
    onEdit(value: number): void;
    onConfirm(value: number): void;
}

export function SubmissionReviewCardDialog(props: SubmissionReviewCardDialogProps) {
    const { itemId, orderId, onClose, onConfirm, onEdit, onChangeItemId, onMissing, ...rest } = props;
    const notification = useNotifications();
    const entities = useAppSelector((state) => state.adminOrders.entities);
    const [loading, setLoading] = useState('');
    const order = useMemo(() => plainToClass(OrderEntity, entities[orderId]), [entities, orderId]);
    const pendingItems = useMemo(
        () => order?.orderItems?.filter((item) => item.status?.orderItemStatus?.id === OrderItemStatusEnum.PENDING),
        [order],
    );

    const currentIndex = useMemo(() => pendingItems.findIndex((item) => item.id === itemId), [pendingItems, itemId]);
    const previousItem = useMemo<OrderItemEntity | null>(
        () => pendingItems[currentIndex - 1] ?? pendingItems[pendingItems.length - 1],
        [pendingItems, currentIndex],
    );
    const currentItem = useMemo<OrderItemEntity | null>(
        () => pendingItems[currentIndex] ?? null,
        [pendingItems, currentIndex],
    );
    const nextItem = useMemo<OrderItemEntity | null>(
        () => pendingItems[currentIndex + 1] ?? pendingItems[0],
        [pendingItems, currentIndex],
    );

    console.log({ nextItem, previousItem, currentItem });

    const handlePrevious = useCallback(() => onChangeItemId(previousItem?.id), [onChangeItemId, previousItem?.id]);
    const handleNext = useCallback(() => onChangeItemId(nextItem?.id), [nextItem?.id, onChangeItemId]);

    const handleClose = useCallback(() => {
        if (onClose) {
            (onClose as any)();
        }
    }, [onClose]);

    const handleConfirm = useCallback(async () => {
        setLoading('confirm');
        try {
            if (currentItem?.id) {
                await onConfirm(currentItem.id);
            }
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');

        if (!nextItem) {
            handleClose();
        } else {
            handleNext();
        }
    }, [nextItem, onConfirm, currentItem?.id, notification, handleClose, handleNext]);

    const handleMissing = useCallback(async () => {
        setLoading('missing');
        try {
            if (currentItem?.id) {
                await onMissing(currentItem.id);
            }
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');

        if (!nextItem) {
            handleClose();
        } else {
            handleNext();
        }
    }, [nextItem, onMissing, currentItem?.id, notification, handleClose, handleNext]);

    const handleEdit = useCallback(async () => {
        setLoading('missing');
        try {
            if (currentItem?.id) {
                await onEdit(currentItem.id);
            }
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');
    }, [onEdit, currentItem?.id, notification]);

    useEffect(
        () => {
            if (rest.open && pendingItems.length === 0) {
                handleClose();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pendingItems.length, rest.open],
    );

    return (
        <ReviewCardDialog
            activeItem={currentItem?.cardProduct}
            itemsLength={pendingItems.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onClose={handleClose}
            disablePrevious={!previousItem || pendingItems.length <= 1}
            disableNext={!nextItem || pendingItems.length <= 1}
            {...rest}
        >
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
