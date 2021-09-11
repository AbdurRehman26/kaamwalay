import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import { useCallback } from 'react';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { changeOrderItemsStatus, changeOrderItemStatus } from '@shared/redux/slices/adminOrdersSlice';
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

    return (
        <CardsList heading={'Confirmed cards'} totals={(items || []).length} onClear={!hasNoCards ? handleClear : null}>
            {!hasNoCards ? (
                items.map((item, index) => (
                    <CardItem
                        label={'Confirmed'}
                        itemId={item.id}
                        key={index}
                        card={item.cardProduct}
                        labelIcon={<CheckIcon color={'inherit'} fontSize={'small'} />}
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
    );
}

export default ConfirmedCards;
