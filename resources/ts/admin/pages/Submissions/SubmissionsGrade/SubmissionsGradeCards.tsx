import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ManageCardDialog from '@shared/components/ManageCardDialog/ManageCardDialog';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { addOrderStatusHistory, editCardOfOrder } from '@shared/redux/slices/adminOrdersSlice';
import { font } from '@shared/styles/utils';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { getAllSubmissions, matchExistingOrderItemsToViewModes } from '@admin/redux/slices/submissionGradeSlice';
import SubmissionsGradeCard from './SubmissionsGradeCard';

const useStyles = makeStyles(
    (theme) => ({
        root: {},
        cards: {
            padding: theme.spacing(2, 0, 3),
        },
    }),
    { name: 'SubmissionsGradeCards' },
);

export function SubmissionsGradeCards() {
    const classes = useStyles();
    const allCards = useAppSelector((state) => state.submissionGradesSlice.allSubmissions);
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    function isCompleteGradingBtnEnabled() {
        const nonReviewedCards = allCards.filter(
            (item: any) => item?.order_item?.status?.order_item_status?.id === OrderItemStatusEnum.CONFIRMED,
        );

        return nonReviewedCards.length === 0;
    }

    async function handleCompleteGrading() {
        await dispatch(
            addOrderStatusHistory({
                orderId: Number(id),
                orderStatusId: OrderStatusEnum.GRADED,
            }),
        );

        history.push(`/submissions/${id}/view`);
    }

    const loadGrades = useCallback(() => {
        dispatch(getAllSubmissions(id))
            .unwrap()
            .then(() => dispatch(matchExistingOrderItemsToViewModes()));
    }, [dispatch, id]);

    const handleOnEditCard = useCallback(
        async (data) => {
            const { orderItemId, declaredValue, card } = data;
            if (orderItemId) {
                await dispatch(
                    editCardOfOrder({
                        orderItemId,
                        orderId: Number(id),
                        cardProductId: card.id,
                        value: declaredValue,
                    }),
                );
                await loadGrades();
            }
        },
        [dispatch, loadGrades, id],
    );

    useEffect(
        () => {
            loadGrades();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id],
    );

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Typography variant={'body1'}>
                <span className={font.fontWeightMedium}>Cards</span>&nbsp;({allCards.length})
            </Typography>
            <Grid container direction={'column'} className={classes.cards}>
                {allCards.map((item: any, index: number) => (
                    <SubmissionsGradeCard
                        key={item.order_item.id}
                        orderID={Number(id)}
                        itemIndex={index}
                        itemId={item.order_item.id}
                        gradeData={item}
                    />
                ))}
            </Grid>
            {isCompleteGradingBtnEnabled() ? (
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
                    <Button variant={'contained'} color={'primary'} onClick={handleCompleteGrading}>
                        Complete Grading
                    </Button>
                </Box>
            ) : null}
            <ManageCardDialog onAdd={handleOnEditCard} />
        </Grid>
    );
}

export default SubmissionsGradeCards;
