import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/VisibilityOutlined';
import React, { useCallback, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import AddCardDialog, { AddCardDialogProps } from '@shared/components/AddCardDialog/AddCardDialog';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { useAdminOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { addOrderStatusHistory } from '@shared/redux/slices/adminOrdersSlice';
import { useSidebarHidden } from '@admin/hooks/useSidebarHidden';
import { useAppDispatch } from '@admin/redux/hooks';
import ConfirmedCards from './ConfirmedCards';
import MissingCards from './MissingCards';
import UnconfirmedCards from './UnconfirmedCards';

export function SubmissionsReview() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const { data, isLoading } = useAdminOrderQuery({
        resourceId: id,
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
                orderStatusId: OrderStatusEnum.ARRIVED,
            }),
        );
        setLoading(true);
    }, [dispatch, data?.id]);

    const handleAddCard = useCallback<AddCardDialogProps['onAdd']>(({ card, declaredValue }) => {
        console.log({ card, declaredValue });
        // TODO: store the card to the order.
        // TODO: set status of the card confirmed.
    }, []);

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
        if (data.hasOrderStatus(OrderStatusEnum.ARRIVED)) {
            if (!data.hasOrderStatus(OrderStatusEnum.GRADED)) {
                return <Redirect to={`/submissions/${data.id}/grade`} />;
            }

            return <Redirect to={`/submissions/${data.id}/view`} />;
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
            <AddCardDialog onAdd={handleAddCard} />
        </>
    );
}

export default SubmissionsReview;
