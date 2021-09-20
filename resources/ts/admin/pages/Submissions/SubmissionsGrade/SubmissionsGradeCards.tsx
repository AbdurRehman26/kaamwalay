import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PaginatedData } from '@shared/classes/PaginatedData';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { addOrderStatusHistory } from '@shared/redux/slices/adminOrdersSlice';
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
    const page = 0;
    const total = 3;
    const { id } = useParams<{ id: string }>();
    const handleMissing = useCallback(() => {}, []);
    const handleNotAccepted = useCallback(() => {}, []);
    const handleChangePage = useCallback(() => {}, []);
    const handleChangeRowsPerPage = useCallback(() => {}, []);

    function isCompleteGradingBtnEnabled() {
        const nonReviewedCards = allCards.filter(
            (item: any) => item.order_item.status.order_item_status.name === 'Confirmed',
        );
        return nonReviewedCards.length === 0;
    }

    function handleCompleteGrading() {
        dispatch(
            addOrderStatusHistory({
                orderId: Number(id),
                orderStatusId: OrderStatusEnum.GRADED,
            }),
        );
    }

    useEffect(() => {
        // @ts-ignore
        dispatch(getAllSubmissions(id))
            .unwrap()
            .then((r) => {
                dispatch(matchExistingOrderItemsToViewModes());
            });
    }, []);

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Typography variant={'body1'}>
                <span className={font.fontWeightMedium}>Cards</span>&nbsp;({allCards.length})
            </Typography>
            <Grid container direction={'column'} className={classes.cards}>
                {allCards.map((item: any, index: number) => (
                    <SubmissionsGradeCard
                        key={item['order_item']['id']}
                        orderID={Number(id)}
                        cardData={item}
                        itemIndex={index}
                        itemId={item['order_item']['id']}
                        onMissing={handleMissing}
                        onNotAccepted={handleNotAccepted}
                    />
                ))}
            </Grid>
            <Divider />
            <TablePagination
                component="div"
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                count={total}
                page={page}
                rowsPerPageOptions={PaginatedData.LimitSet}
                rowsPerPage={PaginatedData.LimitSet[0]}
            />
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
        </Grid>
    );
}

export default SubmissionsGradeCards;
