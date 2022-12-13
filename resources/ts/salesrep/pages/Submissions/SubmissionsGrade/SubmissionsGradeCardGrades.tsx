import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { OutlinedCard } from '@shared/components/OutlinedCard';
import { GradeInput } from './GradeInput';
import { useAdminOrderItemGradeData } from './useAdminOrderItemGradeData';

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
    const {
        frontCentering,
        frontEdge,
        frontCorner,
        frontSurface,
        backSurface,
        backEdge,
        backCorner,
        backCenter,
        cardStatus,
        currentViewMode,
        updateHumanGrade,
        sendHumanGradesToBackend,
    } = useAdminOrderItemGradeData(itemIndex, orderID);

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
                        <GradeInput
                            mainLabel={'Centering'}
                            cardStatus={cardStatus}
                            currentViewMode={currentViewMode}
                            value={frontCentering}
                            disabled={disabled}
                            onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                            onChange={(e: any) => updateHumanGrade('front', 'center', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <GradeInput
                            mainLabel={'Surface'}
                            cardStatus={cardStatus}
                            currentViewMode={currentViewMode}
                            value={frontSurface}
                            disabled={disabled}
                            onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                            onChange={(e: any) => updateHumanGrade('front', 'surface', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <GradeInput
                            mainLabel={'Edges'}
                            cardStatus={cardStatus}
                            currentViewMode={currentViewMode}
                            value={frontEdge}
                            disabled={disabled}
                            onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                            onChange={(e: any) => updateHumanGrade('front', 'edge', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <GradeInput
                            mainLabel={'Corners'}
                            cardStatus={cardStatus}
                            currentViewMode={currentViewMode}
                            value={frontCorner}
                            disabled={disabled}
                            onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                            onChange={(e: any) => updateHumanGrade('front', 'corner', e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Grid container spacing={2}>
                    <Grid item xs={12} container alignItems={'center'} className={classes.headingHolder}>
                        <Typography className={classes.heading}>Back Of Card</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <GradeInput
                            mainLabel={'Centering'}
                            cardStatus={cardStatus}
                            currentViewMode={currentViewMode}
                            value={backCenter}
                            disabled={disabled}
                            onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                            onChange={(e: any) => updateHumanGrade('back', 'center', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <GradeInput
                            mainLabel={'Surface'}
                            cardStatus={cardStatus}
                            currentViewMode={currentViewMode}
                            value={backSurface}
                            disabled={disabled}
                            onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                            onChange={(e: any) => updateHumanGrade('back', 'surface', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <GradeInput
                            mainLabel={'Edges'}
                            cardStatus={cardStatus}
                            currentViewMode={currentViewMode}
                            value={backEdge}
                            disabled={disabled}
                            onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                            onChange={(e: any) => updateHumanGrade('back', 'edge', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <GradeInput
                            mainLabel={'Corners'}
                            cardStatus={cardStatus}
                            currentViewMode={currentViewMode}
                            value={backCorner}
                            disabled={disabled}
                            onBlur={currentViewMode === 'graded_revise_mode' ? () => '' : sendHumanGradesToBackend}
                            onChange={(e: any) => updateHumanGrade('back', 'corner', e.target.value)}
                        />
                    </Grid>
                </Grid>
            </div>
        </OutlinedCard>
    );
}
