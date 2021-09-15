import { makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import { OutlinedCard } from '@shared/components/OutlinedCard';

interface SubmissionsGradeCardGradesProps {
    heading: string;
    view: 'front' | 'back';
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
        headingIcon: {
            opacity: 0.54,
        },
        heading: {
            marginLeft: theme.spacing(1),
            fontWeight: 500,
        },
    }),
    { name: 'SubmissionsGradeCardGrades' },
);

export function SubmissionsGradeCardGrades({ heading, view }: SubmissionsGradeCardGradesProps) {
    const classes = useStyles();

    return (
        <OutlinedCard heading={heading} className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                    <Icon className={classes.headingIcon}>smart_toy</Icon>
                    <Typography className={classes.heading}>Robogrades</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField size={'medium'} variant={'outlined'} value={'0.00'} label={`Centering (${view})`} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={'medium'} variant={'outlined'} value={'0.00'} label={`Surface (${view})`} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={'medium'} variant={'outlined'} value={'0.00'} label={`Edges (${view})`} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={'medium'} variant={'outlined'} value={'0.00'} label={`Corners (${view})`} />
                </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={2}>
                <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                    <FaceIcon className={classes.headingIcon} />
                    <Typography className={classes.heading}>Human Grades</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField size={'medium'} variant={'outlined'} value={'0.00'} label={`Centering (${view})`} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={'medium'} variant={'outlined'} value={'0.00'} label={`Surface (${view})`} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={'medium'} variant={'outlined'} value={'0.00'} label={`Edges (${view})`} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={'medium'} variant={'outlined'} value={'0.00'} label={`Corners (${view})`} />
                </Grid>
            </Grid>
        </OutlinedCard>
    );
}
