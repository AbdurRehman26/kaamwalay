import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useAppSelector } from '@salesrep/redux/hooks';
import { OutlinedCard } from '@shared/components/OutlinedCard';

interface SubmissionsGradeCardRoboGradesProps {
    heading: string;
    disabled?: boolean;
    itemIndex: number;
    icon: any;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(3),
        },
        divider: {
            margin: theme.spacing(3, 0),
        },
        headingHolder: {
            marginBottom: theme.spacing(2),
        },
        gradeReadContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        gradeReadLabel: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        gradeReadValue: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
            marginTop: '12px',
        },
        heading: {
            marginLeft: theme.spacing(1),
            fontWeight: 500,
        },
        alert: {
            marginBottom: theme.spacing(2),
        },
    }),
    { name: 'SubmissionsGradeCardRoboGrades' },
);
export function SubmissionsGradeCardRoboGrades({ heading, itemIndex, icon }: SubmissionsGradeCardRoboGradesProps) {
    const classes = useStyles();

    const roboGradesFront = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].roboGradeValues.front,
    );
    const roboGradesBack = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].roboGradeValues.back,
    );

    return (
        <OutlinedCard heading={heading} icon={icon} className={classes.root}>
            {roboGradesFront === null ? (
                <Alert severity="info" className={classes.alert}>
                    Robogrades are being loaded in the background and will be populated as soon as they are available.
                </Alert>
            ) : null}
            <Grid container spacing={2}>
                <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                    <Typography className={classes.heading}>Front of Card</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesFront !== null ? roboGradesFront?.center : '-'}
                        label={`Centering`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesFront !== null ? roboGradesFront.surface : '-'}
                        label={`Surface`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesFront !== null ? roboGradesFront.edge : '-'}
                        label={`Edges`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesFront !== null ? roboGradesFront.corner : '-'}
                        label={`Corners`}
                    />
                </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={2}>
                <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                    <Typography className={classes.heading}>Back Of Card</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesBack !== null ? roboGradesBack.center : '-'}
                        label={`Centering`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesBack !== null ? roboGradesBack.surface : '-'}
                        label={`Surface`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesBack !== null ? roboGradesBack.edge : '-'}
                        label={`Edges`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesBack !== null ? roboGradesBack.corner : '-'}
                        label={`Corners`}
                    />
                </Grid>
            </Grid>
        </OutlinedCard>
    );
}
