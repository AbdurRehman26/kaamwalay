import PrintIcon from '@mui/icons-material/PrintOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { changeOrderItemStatus, changeOrderItemsStatus } from '@shared/redux/slices/adminOrdersSlice';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import CardItem from './CardItem';
import CardsList from './CardsList';

interface ConfirmedCardsProps {
    items: OrderItemEntity[];
    orderId: number;
}

export function ConfirmedCards({ items, orderId }: ConfirmedCardsProps) {
    const hasNoCards = (items ?? [])?.length === 0;
    const dispatch = useAppDispatch();

    const handleRemove = useCallback(
        async (orderItemId) => {
            await dispatch(
                changeOrderItemStatus({
                    orderItemId,
                    orderId,
                    orderItemStatus: OrderItemStatusEnum.PENDING,
                }),
            );
        },
        [dispatch, orderId],
    );

    const handleClear = useCallback(async () => {
        await dispatch(
            changeOrderItemsStatus({
                orderId,
                orderItemStatus: OrderItemStatusEnum.PENDING,
                items: items.map((item) => item.id),
            }),
        );
    }, [dispatch, items, orderId]);

    const handleAddExtraCard = useCallback(() => {
        dispatch(manageCardDialogActions.setOpen(true));
        dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.List));
    }, [dispatch]);

    return (
        <>
            <CardsList
                heading={'Confirmed Cards'}
                totals={(items || []).length}
                onClear={!hasNoCards ? handleClear : null}
                extraAction={
                    <Box pl={1}>
                        <Button onClick={handleAddExtraCard} variant={'outlined'} color={'primary'}>
                            Add Extra Card
                        </Button>
                    </Box>
                }
            >
                {!hasNoCards ? (
                    items.map((item, index) => (
                        <CardItem
                            label={
                                <Tooltip title={'Print Certificate number of the card. (Coming Soon)'}>
                                    <IconButton size={'small'}>
                                        <PrintIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                            itemId={item.id}
                            key={index}
                            card={item.cardProduct}
                            certificateId={item.certificateNumber}
                            declaredValue={item.declaredValuePerUnit}
                            notes={item.notes}
                            onRemove={handleRemove}
                        />
                    ))
                ) : (
                    <Box padding={7} display={'flex'} justifyContent={'center'}>
                        <Typography variant={'body2'} color={'textSecondary'}>
                            No cards confirmed.
                        </Typography>
                    </Box>
                )}
            </CardsList>
        </>
    );
}

export default ConfirmedCards;
