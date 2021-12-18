import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useCallback, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ManageCardDialog, { ManageCardDialogProps } from '@shared/components/ManageCardDialog/ManageCardDialog';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { useAdminOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { addCardToOrder, addOrderStatusHistory, editCardOfOrder } from '@shared/redux/slices/adminOrdersSlice';
import { useSidebarHidden } from '@admin/hooks/useSidebarHidden';
import { useAppDispatch } from '@admin/redux/hooks';
import ConfirmedCards from './ConfirmedCards';
import MissingCards from './MissingCards';
import UnconfirmedCards from './UnconfirmedCards';

export function SubmissionsReview() {
    const { id } = useParams<'id'>();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const { data, isLoading } = useAdminOrderQuery({
        resourceId: Number(id),
        config: {
            params: {
                include: ['orderItems', 'orderStatus', 'orderStatusHistory.orderStatus'],
            },
        },
    });

    const handleCompleteOrderReview = useCallback(async () => {
        setLoading(false);
        await dispatch(
            addOrderStatusHistory({
                orderId: data?.id,
                orderStatusId: OrderStatusEnum.CONFIRMED,
            }),
        );
        setLoading(true);
    }, [dispatch, data?.id]);

    const handleAddCard = useCallback<ManageCardDialogProps['onAdd']>(
        async ({ card, declaredValue, orderItemId }) => {
            if (!data?.id) {
                return;
            }

            if (orderItemId) {
                await dispatch(
                    editCardOfOrder({
                        orderItemId,
                        orderId: data?.id,
                        cardProductId: card.id,
                        value: declaredValue,
                    }),
                );
            } else {
                await dispatch(
                    addCardToOrder({
                        orderId: data?.id,
                        cardProductId: card.id,
                        value: declaredValue,
                    }),
                );
            }
        },
        [data?.id, dispatch],
    );

    useSidebarHidden();

    if (isLoading) {
        return (
            <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                <CircularProgress />
            </Box>
        );
    }

    const pendingItems = data.getItemsByStatus(OrderItemStatusEnum.PENDING);
    if (pendingItems.length === 0) {
        if (data.hasOrderStatus(OrderStatusEnum.CONFIRMED)) {
            if (!data.hasOrderStatus(OrderStatusEnum.GRADED)) {
                return <Navigate to={`/submissions/${data.id}/grade`} replace />;
            }

            return <Navigate to={`/submissions/${data.id}/view`} replace />;
        }
    }

    return (
        <>
            <Container>
                <Box pt={7} pb={3} display={'flex'} alignItems={'center'}>
                    <Grid item xs>
                        <Typography variant={'h5'}>
                            Review Submission <b># {data.orderNumber}</b>
                        </Typography>
                    </Grid>
                    <Grid container item xs justifyContent={'flex-end'}>
                        <Button
                            component={Link}
                            to={`/submissions/${id}/view`}
                            startIcon={<VisibilityIcon color={'inherit'} />}
                            color={'primary'}
                        >
                            View Submission
                        </Button>
                    </Grid>
                </Box>
                <Divider />
                <Box pt={3} pb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <UnconfirmedCards items={pendingItems} orderId={data.id} />
                        </Grid>
                        <Grid item xs>
                            <ConfirmedCards
                                items={data.getItemsByStatus(OrderItemStatusEnum.CONFIRMED)}
                                orderId={data.id}
                            />
                            <MissingCards
                                items={data.getItemsByStatus(OrderItemStatusEnum.MISSING)}
                                orderId={data.id}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Box height={4} width={'100%'} />
            {pendingItems.length === 0 && data.orderItems?.length > 0 ? (
                <Box
                    position={'fixed'}
                    padding={2}
                    left={0}
                    bottom={0}
                    width={'100%'}
                    bgcolor={'#f9f9f9'}
                    boxShadow={3}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        onClick={handleCompleteOrderReview}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} color={'inherit'} /> : null}
                    >
                        Complete Review
                    </Button>
                </Box>
            ) : null}
            <ManageCardDialog onAdd={handleAddCard} />
        </>
    );
}

export default SubmissionsReview;
