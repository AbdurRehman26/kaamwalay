import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import SearchIcon from '@material-ui/icons/Search';
import { useCallback, useState } from 'react';
import NotesDialog from '@shared/components/NotesDialog/NotesDialog';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { useNotesDialog } from '@shared/hooks/useNotesDialog';
import { changeOrderItemStatus } from '@shared/redux/slices/adminOrdersSlice';
import { font } from '@shared/styles/utils';
import { useAppDispatch } from '@admin/redux/hooks';
import ReviewCardDialog from './ReviewCardDialog';
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
    const handleNext = useCallback(() => setActiveIndex((value) => (value ?? 0) + 1), [setActiveIndex]);
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
            <TextField
                variant={'outlined'}
                placeholder={'Search cards...'}
                size={'small'}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position={'start'}>
                            <SearchIcon color={'disabled'} />
                        </InputAdornment>
                    ),
                }}
            />
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
                                card={item.cardProduct}
                                onPreview={handlePreview}
                                onConfirm={handleConfirm}
                                onMissing={handleMissing}
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
            <ReviewCardDialog
                open={activeIndex !== null}
                onClose={handleClosePreview}
                indexId={activeIndex!}
                orderId={orderId}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onMissing={handleMissing}
                onConfirm={handleConfirm}
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
