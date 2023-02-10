import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import ManageCardDialog from '@salesrep/components/ManageCardDialog/ManageCardDialog';
import { useAppDispatch, useAppSelector } from '@salesrep/redux/hooks';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { useInterval } from '@shared/hooks/useInterval';
import { addOrderStatusHistory, editCardOfOrder } from '@shared/redux/slices/adminOrdersSlice';
import { getAllSubmissions, matchExistingOrderItemsToViewModes } from '@shared/redux/slices/submissionGradeSlice';
import { font } from '@shared/styles/utils';
import SubmissionsGradeCard from './SubmissionsGradeCard';

const useStyles = makeStyles(
    (theme) => ({
        root: {},
        cards: {
            padding: theme.spacing(2, 0, 3),
            marginBottom: theme.spacing(7),
        },
    }),
    { name: 'SubmissionsGradeCards' },
);

export function SubmissionsGradeCards() {
    const classes = useStyles();
    const allCards = useAppSelector((state) => state.submissionGradesSlice.allSubmissions);
    const dispatch = useAppDispatch();
    const { id } = useParams<'id'>();
    const navigate = useNavigate();
    const search = useLocation().search;
    const reviseGradeItemId = new URLSearchParams(search).get('item_id');
    const hasLoadedAllRobogrades = useAppSelector((state) => state.submissionGradesSlice.hasLoadedAllRobogrades);

    function isCompleteGradingBtnEnabled() {
        if (allCards.length === 0) {
            return false;
        }
        const nonReviewedCards = allCards.filter(
            (item: any) => item.orderItem?.status?.orderItemStatus?.name === 'Confirmed',
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

        navigate(`/submissions/${id}/view`);
    }

    const loadGrades = useCallback(
        (fromAgs = true) => {
            dispatch(getAllSubmissions({ fromAgs: fromAgs, id: Number(id) }))
                .unwrap()
                .then(() => dispatch(matchExistingOrderItemsToViewModes()));
        },
        [dispatch, id],
    );

    const loadDataOnRecursively = useCallback(() => {
        if (!hasLoadedAllRobogrades) loadGrades(false);
    }, [hasLoadedAllRobogrades, loadGrades]);

    useInterval(() => {
        loadDataOnRecursively();
    }, 5000);

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
                await loadGrades(false);
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

    useEffect(() => {
        setTimeout(() => {
            const item = document.getElementById('card-id-' + reviseGradeItemId);
            if (item) {
                window.scrollTo(item.getBoundingClientRect());
            }
        }, 2000);
    }, [reviseGradeItemId]);

    return (
        <Grid container direction={'column'} className={classes.root}>
            {allCards.length === 0 ? (
                <Box paddingY={3} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant={'body1'}>
                        <span className={font.fontWeightMedium}>Cards</span>&nbsp;({allCards.length})
                    </Typography>
                    <Grid container direction={'column'} className={classes.cards}>
                        {allCards.map((item: any, index: number) => (
                            <div id={'card-id-' + item.orderItem.id} key={item.orderItem.id}>
                                <SubmissionsGradeCard
                                    key={item.orderItem.id}
                                    orderID={Number(id)}
                                    itemIndex={index}
                                    notes={item.orderItem.notes}
                                    internalNotes={item.orderItem.internalNotes}
                                    itemId={item.orderItem.id}
                                    gradeData={item}
                                />
                            </div>
                        ))}
                    </Grid>
                </>
            )}
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