import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useAppDispatch } from '@salesrep/redux/hooks';
import { useCallback, useState } from 'react';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { changeOrderItemNotes, changeOrderItemStatus } from '@shared/redux/slices/adminOrdersSlice';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { font } from '@shared/styles/utils';
import { SubmissionReviewCardDialog } from './SubmissionReviewCardDialog';
import UnconfirmedCard from './UnconfirmedCard';

interface UnconfirmedCardsProps {
    orderId: number;
    items: OrderItemEntity[];
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(3),
            border: '1px solid #e0e0e0',
        },
        header: {
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #e0e0e0',
            padding: theme.spacing(1.5, 2),
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

    const handleCardNotesChange = useCallback(
        async (orderItemId: number, internalNotes: string) => {
            await dispatch(
                changeOrderItemNotes({
                    orderItemId,
                    orderId,
                    internalNotes,
                }),
            );
        },
        [dispatch, orderId],
    );
    return (
        <>
            <Card variant={'outlined'} className={classes.root}>
                <CardHeader
                    className={classes.header}
                    title={
                        <Typography variant={'body1'}>
                            <span className={font.fontWeightMedium}>Unconfirmed Cards</span> ({(items || []).length})
                        </Typography>
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
                                onCardNotesChange={handleCardNotesChange}
                                onEdit={handleEdit}
                                disableConfirm={item.cardProduct.addedByCustomer}
                                onSwapCard={handleSwapCard}
                                orderId={item.orderId}
                                internalNotes={item.internalNotes}
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
