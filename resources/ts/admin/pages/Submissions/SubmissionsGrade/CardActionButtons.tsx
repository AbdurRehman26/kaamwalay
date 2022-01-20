import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useAdminOrderItemGradeData } from '@admin/pages/Submissions/SubmissionsGrade/useAdminOrderItemGradeData';
import { useSubmissionsGradeCardStyles } from '@admin/pages/Submissions/SubmissionsGrade/SubmissionsGradeCardStyles';

interface Props {
    itemIndex: number;
    orderID: number;
    gradeData?: any;
    notes?: string;
    internalNotes?: string;
}

export function CardActionButtons({ itemIndex, orderID, gradeData, notes, internalNotes }: Props) {
    const orderItemGradeData = useAdminOrderItemGradeData(itemIndex, orderID, gradeData, notes, internalNotes);
    const classes = useSubmissionsGradeCardStyles();

    return (
        <Grid container className={classes.actions}>
            {orderItemGradeData.cardStatus.toLowerCase() === 'confirmed' ||
            ['not_accepted_pending_notes', 'missing_pending_notes', 'graded_revise_mode'].includes(
                orderItemGradeData.currentViewMode,
            ) ? (
                <>
                    <Grid item xs>
                        <Button
                            variant={'contained'}
                            color={'inherit'}
                            onClick={orderItemGradeData.handleNotAccepted}
                            className={classes.button}
                        >
                            Not Accepted
                        </Button>
                        <Button
                            variant={'contained'}
                            color={'inherit'}
                            onClick={orderItemGradeData.handleMissing}
                            className={classes.button}
                        >
                            Missing
                        </Button>
                        <Button
                            variant={'contained'}
                            color={'inherit'}
                            onClick={orderItemGradeData.handleEdit}
                            className={classes.button}
                        >
                            Edit Card
                        </Button>
                    </Grid>
                </>
            ) : null}

            {orderItemGradeData.cardStatus.toLowerCase() !== 'confirmed' &&
            !['not_accepted_pending_notes', 'missing_pending_notes', 'graded_revise_mode'].includes(
                orderItemGradeData.currentViewMode,
            ) ? (
                <Grid item xs>
                    <Button
                        variant={'contained'}
                        color={'inherit'}
                        onClick={orderItemGradeData.handleRevisePress}
                        className={classes.button}
                    >
                        Revise
                    </Button>
                </Grid>
            ) : null}
        </Grid>
    );
}
