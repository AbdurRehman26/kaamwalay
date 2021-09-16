import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PaginatedData } from '@shared/classes/PaginatedData';
import { font } from '@shared/styles/utils';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { getAllSubmissions } from '@admin/redux/slices/submissionGradeSlice';
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

    useEffect(() => {
        // @ts-ignore
        dispatch(getAllSubmissions(id));
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
        </Grid>
    );
}

export default SubmissionsGradeCards;
