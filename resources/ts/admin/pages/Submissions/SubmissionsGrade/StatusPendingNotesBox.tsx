import OutlinedCard from '@shared/components/OutlinedCard';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSubmissionsGradeCardStyles } from '@admin/pages/Submissions/SubmissionsGrade/SubmissionsGradeCardStyles';
import { useAdminOrderItemGradeData } from '@admin/pages/Submissions/SubmissionsGrade/useAdminOrderItemGradeData';
import { useMemo } from 'react';

interface Props {
    itemIndex: number;
    orderID: number;
    gradeData: any;
    notes?: string;
    internalNotes?: string;
}

export function StatusPendingNotesBox({ itemIndex, orderID, gradeData, notes, internalNotes }: Props) {
    const classes = useSubmissionsGradeCardStyles();
    const orderItemGradeData = useAdminOrderItemGradeData(itemIndex, orderID, gradeData, notes, internalNotes);

    const showNotAcceptedOrPendingNotes = useMemo(() => {
        return (
            orderItemGradeData.currentViewMode === 'not_accepted_pending_notes' ||
            orderItemGradeData.currentViewMode === 'missing_pending_notes'
        );
    }, [orderItemGradeData.currentViewMode]);
    return (
        <>
            {showNotAcceptedOrPendingNotes ? (
                <>
                    <OutlinedCard
                        heading={orderItemGradeData.viewModes[itemIndex]?.sectionTitle}
                        className={classes.cardViewModeActionsContainer}
                    >
                        <TextField
                            label="Enter Notes"
                            multiline
                            rows={4}
                            value={orderItemGradeData.cardNotes}
                            sx={{ marginTop: '16px' }}
                            fullWidth
                            onChange={orderItemGradeData.handleNotesChange}
                        />
                        <div className={classes.noteActionsContainer}>
                            <Button
                                variant={'contained'}
                                disableElevation
                                onClick={orderItemGradeData.handleCancel}
                                className={classes.submitButton}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={'contained'}
                                disableElevation
                                disabled={orderItemGradeData.isNotesDoneBtnDisabled()}
                                color={'primary'}
                                onClick={orderItemGradeData.handleNotesDonePress}
                                className={classes.submitButton}
                            >
                                Done
                            </Button>
                        </div>
                    </OutlinedCard>
                </>
            ) : null}
        </>
    );
}
