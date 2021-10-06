import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import { useCallback } from 'react';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { changeOrderItemsStatus, changeOrderItemStatus } from '@shared/redux/slices/adminOrdersSlice';
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
                heading={'Confirmed cards'}
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
