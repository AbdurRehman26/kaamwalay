import { useCallback } from 'react';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { changeOrderItemStatus, changeOrderItemsStatus } from '@shared/redux/slices/adminOrdersSlice';
import { useAppDispatch } from '../../../redux/hooks';
import CardItem from './CardItem';
import CardsList from './CardsList';

interface MissingCardsProps {
    items: OrderItemEntity[];
    orderId: number;
}

export function MissingCards({ items, orderId }: MissingCardsProps) {
    const count = (items || []).length;
    const hasNoCards = count === 0;
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

    if (hasNoCards) {
        return null;
    }

    return (
        <CardsList heading={'Missing cards'} totals={count} onClear={handleClear}>
            {items.map((item, index) => (
                <CardItem
                    label={'Missing'}
                    itemId={item.id}
                    key={index}
                    card={item.cardProduct}
                    certificateId={item.certificateNumber}
                    declaredValue={item.declaredValuePerUnit}
                    onRemove={handleRemove}
                />
            ))}
        </CardsList>
    );
}

export default MissingCards;
