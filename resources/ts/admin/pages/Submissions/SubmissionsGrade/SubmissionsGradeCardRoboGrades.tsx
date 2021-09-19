import { makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { OutlinedCard } from '@shared/components/OutlinedCard';
import { useAppSelector } from '@admin/redux/hooks';

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
        heading: {
            marginLeft: theme.spacing(1),
            fontWeight: 500,
        },
    }),
    { name: 'SubmissionsGradeCardRoboGrades' },
);
export function SubmissionsGradeCardRoboGrades({ heading, itemIndex, icon }: SubmissionsGradeCardRoboGradesProps) {
    const classes = useStyles();

    const roboGradesFront = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].robo_grade_values.front,
    );
    const roboGradesBack = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].robo_grade_values.back,
    );

    return (
        <OutlinedCard heading={heading} icon={icon} className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                    <Typography className={classes.heading}>Front of Card</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={roboGradesFront !== null ? roboGradesFront.center : '-'}
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
