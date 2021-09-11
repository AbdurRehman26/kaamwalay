import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/VisibilityOutlined';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { useAdminOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { useSidebarHidden } from '@admin/hooks/useSidebarHidden';
import ConfirmedCards from './ConfirmedCards';
import MissingCards from './MissingCards';
import UnconfirmedCards from './UnconfirmedCards';

export function SubmissionsReview() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useAdminOrderQuery({
        resourceId: id,
        config: {
            params: {
                include: ['orderItems'],
            },
        },
    });

    useSidebarHidden();

    if (isLoading) {
        return (
            <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                <CircularProgress />
            </Box>
        );
    }

    const pendingItems = data.getItemsByStatus(OrderItemStatusEnum.PENDING);

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
                    <Button variant={'contained'} color={'primary'}>
                        Complete Review
                    </Button>
                </Box>
            ) : null}
        </>
    );
}

export default SubmissionsReview;
