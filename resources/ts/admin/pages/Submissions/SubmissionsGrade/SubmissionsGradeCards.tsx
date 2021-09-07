import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback } from 'react';
import { PaginatedData } from '@shared/classes/PaginatedData';
import { font } from '@shared/styles/utils';
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
    const page = 0;
    const total = 3;

    const handleMissing = useCallback(() => {}, []);
    const handleNotAccepted = useCallback(() => {}, []);
    const handleChangePage = useCallback(() => {}, []);
    const handleChangeRowsPerPage = useCallback(() => {}, []);

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Typography variant={'body1'}>
                <span className={font.fontWeightMedium}>Cards</span>&nbsp;(3)
            </Typography>
            <Grid container direction={'column'} className={classes.cards}>
                <SubmissionsGradeCard itemId={1} onMissing={handleMissing} onNotAccepted={handleNotAccepted} />
                <SubmissionsGradeCard itemId={2} onMissing={handleMissing} onNotAccepted={handleNotAccepted} />
                <SubmissionsGradeCard itemId={3} onMissing={handleMissing} onNotAccepted={handleNotAccepted} />
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
