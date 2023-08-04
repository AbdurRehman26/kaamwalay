import CheckIcon from '@mui/icons-material/Check';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useState } from 'react';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import {
    changeOrderItemNotes,
    changeOrderItemStatus,
    changeOrderItemsStatus,
} from '@shared/redux/slices/adminOrdersSlice';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { font } from '@shared/styles/utils';
import { useAppDispatch } from '@admin/redux/hooks';
import { SubmissionReviewCardDialog } from './SubmissionReviewCardDialog';
import UnconfirmedCard from './UnconfirmedCard';

interface UnconfirmedCardsProps {
    orderId: number;
    items: OrderItemEntity[];
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            border: '1px solid #e0e0e0',
        },
        header: {
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #e0e0e0',
            padding: theme.spacing(1.5, 2),
        },
        headerContent: {
            display: 'flex',
            alignItems: 'center',
        },
        heading: {
            flexGrow: 1,
        },
        content: {
            padding: '0 !important',
        },
    }),
    { name: 'UnconfirmedCards' },
);

export function UnconfirmedCards({ items, orderId }: UnconfirmedCardsProps) {
    const [activeItemId, setActiveItemId] = useState<number | null>(null);

    const classes = useStyles();
    const dispatch = useAppDispatch();
    const handlePreview = useCallback((value) => setActiveItemId(value), [setActiveItemId]);
    const handleClosePreview = useCallback(() => setActiveItemId(null), [setActiveItemId]);
    const [loading, setLoading] = useState(false);
    const notification = useNotifications();

    const handleConfirm = useCallback(
        async (orderItemId) => {
            await dispatch(
                changeOrderItemStatus({
                    orderItemId,
                    orderId,
                    orderItemStatus: OrderItemStatusEnum.CONFIRMED,
                }),
            );
        },
        [dispatch, orderId],
    );

    const handleConfirmAll = useCallback(async () => {
        await dispatch(
            changeOrderItemsStatus({
                orderId,
                orderItemStatus: OrderItemStatusEnum.CONFIRMED,
                items: items.map((item) => item.id),
            }),
        );
    }, [dispatch, items, orderId]);

    const handleSwapCard = useCallback(
        (orderItemId) => {
            const activeItem = items.find((item) => item.id === orderItemId);
            if (activeItem) {
                dispatch(
                    manageCardDialogActions.editCard({
                        orderItemId,
                        card: activeItem.cardProduct,
                        declaredValue: activeItem.declaredValuePerUnit,
                    }),
                );
                dispatch(manageCardDialogActions.backup());
                dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.List));
            }
        },
        [dispatch, items],
    );

    const handleEdit = useCallback(
        (orderItemId) => {
            const activeItem = items.find((item) => item.id === orderItemId);
            if (activeItem) {
                dispatch(
                    manageCardDialogActions.editCard({
                        orderItemId,
                        card: activeItem.cardProduct,
                        declaredValue: activeItem.declaredValuePerUnit,
                    }),
                );
            }
        },
        [dispatch, items],
    );

    const handleMarkCardMissing = useCallback(
        async (orderItemId: number) => {
            await dispatch(
                changeOrderItemStatus({
                    orderItemId,
                    orderId,
                    orderItemStatus: OrderItemStatusEnum.MISSING,
                }),
            );
        },
        [dispatch, orderId],
    );

    const handleMarkCardNotAccepted = useCallback(
        async (orderItemId: number) => {
            await dispatch(
                changeOrderItemStatus({
                    orderItemId,
                    orderId,
                    orderItemStatus: OrderItemStatusEnum.NOT_ACCEPTED,
                }),
            );
        },
        [dispatch, orderId],
    );

    const handleCardNotesChange = useCallback(
        async (orderItemId: number, internalNotes?: string, notes?: string) => {
            await dispatch(
                changeOrderItemNotes({
                    orderItemId,
                    orderId,
                    internalNotes,
                    notes,
                }),
            );
        },
        [dispatch, orderId],
    );

    const onConfirmAll = useCallback(async () => {
        setLoading(true);
        try {
            await handleConfirmAll();
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading(false);
    }, [handleConfirmAll, notification]);

    return (
        <>
            <Card variant={'outlined'} className={classes.root}>
                <CardHeader
                    className={classes.header}
                    classes={{ content: classes.headerContent }}
                    title={
                        <Typography variant={'body1'} className={classes.heading}>
                            <span className={font.fontWeightMedium}>Unconfirmed Cards</span> ({(items || []).length})
                        </Typography>
                    }
                    subheader={
                        <Box pl={1}>
                            <LoadingButton
                                loading={loading}
                                disabled={!items.length || items.some((item) => item.cardProduct.addedByCustomer)}
                                onClick={onConfirmAll}
                                variant={'outlined'}
                                color={'primary'}
                            >
                                Confirm All
                            </LoadingButton>
                        </Box>
                    }
                    disableTypography
                />
                <CardContent className={classes.content}>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <UnconfirmedCard
                                key={index}
                                itemId={item.id}
                                declaredValue={item.declaredValuePerUnit}
                                card={item.cardProduct}
                                onPreview={handlePreview}
                                onConfirm={handleConfirm}
                                onMissing={handleMarkCardMissing}
                                onNotAccepted={handleMarkCardNotAccepted}
                                onCardNotesChange={handleCardNotesChange}
                                onEdit={handleEdit}
                                disableConfirm={item.cardProduct.addedByCustomer}
                                onSwapCard={handleSwapCard}
                                orderId={item.orderId}
                                internalNotes={item.internalNotes}
                                notes={item.notes}
                            />
                        ))
                    ) : (
                        <Box
                            padding={4}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            flexDirection={'column'}
                        >
                            <Box mb={1}>
                                <CheckIcon color={'disabled'} />
                            </Box>
                            <Typography variant={'body2'} color={'textSecondary'}>
                                All cards have been reviewed.
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
            <SubmissionReviewCardDialog
                open={activeItemId !== null}
                onClose={handleClosePreview}
                itemId={activeItemId!}
                orderId={orderId}
                onMissing={handleMarkCardMissing}
                onConfirm={handleConfirm}
                onEdit={handleEdit}
                onChangeItemId={handlePreview}
            />
        </>
    );
}

export default UnconfirmedCards;
