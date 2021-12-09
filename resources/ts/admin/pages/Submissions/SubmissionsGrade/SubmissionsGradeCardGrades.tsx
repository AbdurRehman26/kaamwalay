import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
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
        disabled: {
            opacity: 0.2,
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
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues.front.center,
    );
    const frontEdge = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues.front.edge,
    );
    const frontCorner = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues.front.corner,
    );
    const frontSurface = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues.front.surface,
    );
    const backSurface = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues.back.surface,
    );
    const backEdge = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues.back.edge,
    );
    const backCorner = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues.back.corner,
    );
    const backCenter = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues.back.center,
    );
    const itemID = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].id);
    const humanGrades = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].humanGradeValues,
    );

    const cardStatus = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.status?.orderItemStatus?.name,
    );
    const currentViewMode = useAppSelector((state) => state.submissionGradesSlice.viewModes[itemIndex]?.name);

    function updateHumanGrade(side: string, part: string, gradeValue: string) {
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
            humanGradeValues: humanGrades,
            gradeDelta: 0,
        });
        dispatch(updateExistingCardData({ id: itemID, data: response.data }));
    }

    return (
        <OutlinedCard heading={heading} icon={icon} className={classes.root}>
            {disabled ? (
                <Alert severity="info" className={classes.alert}>
                    Human Grades are disabled until RoboGrades are available
                </Alert>
            ) : null}

            <div className={disabled ? classes.disabled : ''}>
                <Grid container spacing={2}>
                    <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                        <Typography className={classes.heading}>Front of Card</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                            <TextField
                                size={'medium'}
                                variant={'outlined'}
                                value={frontCentering}
                                disabled={disabled}
                                onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                                onChange={(e) => updateHumanGrade('front', 'center', e.target.value)}
                                label={`Centering`}
                            />
                        ) : (
                            <div className={classes.gradeReadContainer}>
                                <div className={classes.gradeReadLabel}>Centering</div>
                                <div className={classes.gradeReadValue}>{frontCentering}</div>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                            <TextField
                                size={'medium'}
                                variant={'outlined'}
                                value={frontSurface}
                                disabled={disabled}
                                onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                                onChange={(e) => updateHumanGrade('front', 'surface', e.target.value)}
                                label={`Surface`}
                            />
                        ) : (
                            <div className={classes.gradeReadContainer}>
                                <div className={classes.gradeReadLabel}>Surface</div>
                                <div className={classes.gradeReadValue}>{frontSurface}</div>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                            <TextField
                                size={'medium'}
                                variant={'outlined'}
                                value={frontEdge}
                                disabled={disabled}
                                onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                                onChange={(e) => updateHumanGrade('front', 'edge', e.target.value)}
                                label={`Edges`}
                            />
                        ) : (
                            <div className={classes.gradeReadContainer}>
                                <div className={classes.gradeReadLabel}>Edges</div>
                                <div className={classes.gradeReadValue}>{frontEdge}</div>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                            <TextField
                                size={'medium'}
                                variant={'outlined'}
                                value={frontCorner}
                                disabled={disabled}
                                onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                                onChange={(e) => updateHumanGrade('front', 'corner', e.target.value)}
                                label={`Corners`}
                            />
                        ) : (
                            <div className={classes.gradeReadContainer}>
                                <div className={classes.gradeReadLabel}>Corners</div>
                                <div className={classes.gradeReadValue}>{frontCorner}</div>
                            </div>
                        )}
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Grid container spacing={2}>
                    <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                        <Typography className={classes.heading}>Back Of Card</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                            <TextField
                                size={'medium'}
                                variant={'outlined'}
                                value={backCenter}
                                disabled={disabled}
                                onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                                onChange={(e) => updateHumanGrade('back', 'center', e.target.value)}
                                label={`Centering`}
                            />
                        ) : (
                            <div className={classes.gradeReadContainer}>
                                <div className={classes.gradeReadLabel}>Centering</div>
                                <div className={classes.gradeReadValue}>{backCenter}</div>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                            <TextField
                                size={'medium'}
                                variant={'outlined'}
                                value={backSurface}
                                disabled={disabled}
                                onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                                onChange={(e) => updateHumanGrade('back', 'surface', e.target.value)}
                                label={`Surface`}
                            />
                        ) : (
                            <div className={classes.gradeReadContainer}>
                                <div className={classes.gradeReadLabel}>Surface</div>
                                <div className={classes.gradeReadValue}>{backSurface}</div>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                            <TextField
                                size={'medium'}
                                variant={'outlined'}
                                value={backEdge}
                                disabled={disabled}
                                onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                                onChange={(e) => updateHumanGrade('back', 'edge', e.target.value)}
                                label={`Edges`}
                            />
                        ) : (
                            <div className={classes.gradeReadContainer}>
                                <div className={classes.gradeReadLabel}>Edges</div>
                                <div className={classes.gradeReadValue}>{backEdge}</div>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                            <TextField
                                size={'medium'}
                                variant={'outlined'}
                                value={backCorner}
                                disabled={disabled}
                                onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                                onChange={(e) => updateHumanGrade('back', 'corner', e.target.value)}
                                label={`Corners`}
                            />
                        ) : (
                            <div className={classes.gradeReadContainer}>
                                <div className={classes.gradeReadLabel}>Corners</div>
                                <div className={classes.gradeReadValue}>{backCorner}</div>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </div>
        </OutlinedCard>
    );
}
