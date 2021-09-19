import { makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { OutlinedCard } from '@shared/components/OutlinedCard';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { updateExistingCardData, updateHumanGradeValue } from '@admin/redux/slices/submissionGradeSlice';

interface SubmissionsGradeCardGradesProps {
    heading: string;
    disabled?: boolean;
    orderID: number;
    itemIndex: number;
    icon: any;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(3),
        },
        alert: {
            marginBottom: theme.spacing(2),
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
    { name: 'SubmissionsGradeCardGrades' },
);
export function SubmissionsGradeCardGrades({
    heading,
    orderID,
    disabled,
    itemIndex,
    icon,
}: SubmissionsGradeCardGradesProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const apiService = useInjectable(APIService);

    const frontCentering = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values.front.center,
    );
    const frontEdge = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values.front.edge,
    );
    const frontCorner = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values.front.corner,
    );
    const frontSurface = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values.front.surface,
    );
    const backSurface = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values.back.surface,
    );
    const backEdge = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values.back.edge,
    );
    const backCorner = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values.back.corner,
    );
    const backCenter = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values.back.center,
    );
    const itemID = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].id);
    const humanGrades = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].human_grade_values,
    );
    function updateHumanGrade(side: string, part: string, gradeValue: number) {
        dispatch(
            updateHumanGradeValue({
                itemIndex,
                side,
                part,
                gradeValue,
            }),
        );
    }

    async function sendHumanGradesToBackend() {
        const endpoint = apiService.createEndpoint(`admin/orders/${orderID}/cards/${itemID}/grades`);
        const response = await endpoint.put('', {
            human_grade_values: humanGrades,
        });
        dispatch(updateExistingCardData({ id: itemID, data: response.data }));
    }

    return (
        <OutlinedCard heading={heading} icon={icon} className={classes.root}>
            <Alert severity="info" className={classes.alert}>
                Human Grades are disabled until RoboGrades are available
            </Alert>
            <Grid container spacing={2}>
                <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                    <Typography className={classes.heading}>Front of Card</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={frontCentering}
                        disabled={disabled}
                        onBlur={sendHumanGradesToBackend}
                        onChange={(e) => updateHumanGrade('front', 'center', Number(e.target.value))}
                        label={`Centering`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={frontSurface}
                        disabled={disabled}
                        onBlur={sendHumanGradesToBackend}
                        onChange={(e) => updateHumanGrade('front', 'surface', Number(e.target.value))}
                        label={`Surface`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={frontEdge}
                        disabled={disabled}
                        onBlur={sendHumanGradesToBackend}
                        onChange={(e) => updateHumanGrade('front', 'edge', Number(e.target.value))}
                        label={`Edges`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={frontCorner}
                        disabled={disabled}
                        onBlur={sendHumanGradesToBackend}
                        onChange={(e) => updateHumanGrade('front', 'corner', Number(e.target.value))}
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
                        value={backCenter}
                        disabled={disabled}
                        onBlur={sendHumanGradesToBackend}
                        onChange={(e) => updateHumanGrade('back', 'center', Number(e.target.value))}
                        label={`Centering`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={backSurface}
                        disabled={disabled}
                        onBlur={sendHumanGradesToBackend}
                        onChange={(e) => updateHumanGrade('back', 'surface', Number(e.target.value))}
                        label={`Surface`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={backEdge}
                        disabled={disabled}
                        onBlur={sendHumanGradesToBackend}
                        onChange={(e) => updateHumanGrade('back', 'edge', Number(e.target.value))}
                        label={`Edges`}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size={'medium'}
                        variant={'outlined'}
                        value={backCorner}
                        disabled={disabled}
                        onBlur={sendHumanGradesToBackend}
                        onChange={(e) => updateHumanGrade('back', 'corner', Number(e.target.value))}
                        label={`Corners`}
                    />
                </Grid>
            </Grid>
        </OutlinedCard>
    );
}
