import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ManageCardDialog from '@shared/components/ManageCardDialog/ManageCardDialog';
import { TablePagination } from '@shared/components/TablePagination';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { useRetry } from '@shared/hooks/useRetry';
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
            marginBottom: theme.spacing(7),
        },
        tablePagination: {
            marginTop: '28px',
            borderTop: '1px solid #E0E0E0',
        },
        itemsPerPageLabel: {
            fontFamily: 'Roboto',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '16px',
            letterSpacing: '0.2088px',
            color: 'rgba(0, 0, 0, 0.541176)',
        },
    }),
    { name: 'SubmissionsGradeCards' },
);

export function SubmissionsGradeCards() {
    const classes = useStyles();
    const allCards = useAppSelector((state) => state.submissionGradesSlice.allSubmissions);
    const gradesPagination = useAppSelector((state) => state.submissionGradesSlice.gradesPagination);
    const dispatch = useAppDispatch();
    const { id } = useParams<'id'>();
    const navigate = useNavigate();
    const search = useLocation().search;
    const reviseGradeItemId = new URLSearchParams(search).get('item_id');
    const hasLoadedAllRobogrades = useAppSelector((state) => state.submissionGradesSlice.hasLoadedAllRobogrades);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(24);

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
        (perPage = 24, page = 1, fromAgs = true) => {
            dispatch(getAllSubmissions({ fromAgs, id: Number(id), page, perPage, itemId: reviseGradeItemId }))
                .unwrap()
                .then(() => (fromAgs ? dispatch(matchExistingOrderItemsToViewModes()) : null));
        },
        [dispatch, id, reviseGradeItemId],
    );

    useRetry(
        () => {
            loadGrades(perPage, page, false);
        },
        () => !hasLoadedAllRobogrades,
        { windowTime: 5000 },
    );

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
                await loadGrades(perPage, page, false);
            }
        },
        [dispatch, id, loadGrades, perPage, page],
    );

    const handlePageChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        setPage(page + 1);
    }, []);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setPerPage(parseInt(event.target.value));
    }, []);

    useEffect(
        () => {
            loadGrades();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id],
    );

    useEffect(() => {
        loadGrades(perPage, page, false);
    }, [perPage, page, loadGrades]);

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
                        <TablePagination
                            className={classes.tablePagination}
                            count={gradesPagination.meta.total}
                            page={gradesPagination.meta.currentPage - 1}
                            rowsPerPage={gradesPagination.meta.perPage}
                            rowsPerPageOptions={[24, 48, 72, 96, 120]}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            labelRowsPerPage={
                                <Typography className={classes.itemsPerPageLabel}>Items Per Page:</Typography>
                            }
                        />
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
