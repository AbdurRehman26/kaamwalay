import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useState } from 'react';
import NotesDialog from '@shared/components/NotesDialog/NotesDialog';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { useNotesDialog } from '@shared/hooks/useNotesDialog';
import { changeOrderItemStatus } from '@shared/redux/slices/adminOrdersSlice';
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
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const { handleOpen, ...notesDialogProps } = useNotesDialog();

    const classes = useStyles();
    const dispatch = useAppDispatch();

    const handlePreview = useCallback((value) => setActiveIndex(value), [setActiveIndex]);
    const handleNext = useCallback(
        () =>
            setActiveIndex((value) => {
                const nextValue = (value ?? 0) + 1;
                const lastValue = items.length - 1;

                if (nextValue > lastValue) {
                    return 0;
                }

                return Math.max(Math.min(nextValue, lastValue), 0);
            }),
        [setActiveIndex, items],
    );
    const handlePrevious = useCallback(
        () => setActiveIndex((value) => Math.max((value ?? 0) - 1, 0)),
        [setActiveIndex],
    );

    const handleClosePreview = useCallback(() => setActiveIndex(null), [setActiveIndex]);

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

    const handleMissing = useCallback((orderItemId) => handleOpen({ orderItemId }), [handleOpen]);
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

    const handleSubmitNotes = useCallback(
        async (notes: string, { orderItemId }) => {
            await dispatch(
                changeOrderItemStatus({
                    orderItemId,
                    orderId,
                    orderItemStatus: OrderItemStatusEnum.MISSING,
                    notes,
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
                                index={index}
                                itemId={item.id}
                                declaredValue={item.declaredValuePerUnit}
                                card={item.cardProduct}
                                onPreview={handlePreview}
                                onConfirm={handleConfirm}
                                onMissing={handleMissing}
                                onEdit={handleEdit}
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
                open={activeIndex !== null}
                onClose={handleClosePreview}
                indexId={activeIndex!}
                orderId={orderId}
                itemsLength={items.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onMissing={handleMissing}
                onConfirm={handleConfirm}
                onEdit={handleEdit}
                disablePrevious={activeIndex === 0}
                disableNext={!!activeIndex && activeIndex >= items.length - 1}
            />
            <NotesDialog
                heading={'Add Notes'}
                description={'Add notes for the missing status of the order item.'}
                onSubmitNotes={handleSubmitNotes}
                {...notesDialogProps}
            />
        </>
    );
}

export default UnconfirmedCards;
