import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Link } from 'react-router-dom';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { cx } from '@shared/lib/utils/cx';
import { font } from '@shared/styles/utils';

interface SubmissionsGradeHeaderProps {
    orderId: string | number;
    orderNumber: string;
    reviewedAt: DateLike;
    reviewer: string;
    cardsGraded: number;
    cardsInOrder: number;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(4, 0),
            backgroundColor: '#f9f9f9',
        },
        button: {
            marginLeft: theme.spacing(1),
            borderRadius: 2,
        },
        buttonDisabled: {
            pointerEvents: 'none',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            color: 'rgba(0, 0, 0, 0.54)',
            '& b': {
                color: 'rgba(0, 0, 0, 0.87)',
            },
        },
    }),
    { name: 'SubmissionsGradeHeader' },
);

export function SubmissionsGradeHeader({
    orderId,
    orderNumber,
    reviewer,
    cardsGraded,
    reviewedAt,
    cardsInOrder,
}: SubmissionsGradeHeaderProps) {
    const classes = useStyles();

    return (
        <header className={classes.root}>
            <Container>
                <Grid container alignItems={'flex-start'}>
                    <Grid container item xs direction={'column'}>
                        <Typography variant={'h5'}>
                            Grade Submission <b># {orderNumber}</b>
                        </Typography>
                        <Typography variant={'caption'}>
                            <span className={font.fontWeightMedium}>Reviewed</span>:&nbsp;
                            {formatDate(reviewedAt, 'MM/DD/YYYY [at] hh:mm A')}&nbsp;
                            <Typography variant={'caption'} color={'textSecondary'} component={'span'}>
                                ({reviewer})
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid container item xs justifyContent={'flex-end'}>
                        <Button
                            className={cx(classes.buttonDisabled, classes.button)}
                            variant={'outlined'}
                            disableFocusRipple
                        >
                            {cardsGraded !== cardsInOrder ? 'Grading Incomplete' : 'Grading Complete'}
                        </Button>
                        <Button
                            className={cx(classes.buttonDisabled, classes.button)}
                            variant={'outlined'}
                            disableFocusRipple
                        >
                            <b>
                                {cardsGraded}/{cardsInOrder}
                            </b>
                            &nbsp;Cards Graded
                        </Button>
                        <Button
                            component={Link}
                            to={`/submissions/${orderId}/view`}
                            className={classes.button}
                            variant={'contained'}
                            color={'inherit'}
                            startIcon={<VisibilityIcon color={'inherit'} />}
                        >
                            View Submission
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </header>
    );
}

export default SubmissionsGradeHeader;
