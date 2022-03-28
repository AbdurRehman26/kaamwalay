import FaceIcon from '@mui/icons-material/Face';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { ReactComponent as OutlinedToyIcon } from '@shared/assets/icons/optimisedSmartToyIcon.svg';
import {
    AccordionCardItem,
    AccordionCardItemContent,
    AccordionCardItemHeader,
} from '@shared/components/AccordionCardItem';
import OutlinedCard from '@shared/components/OutlinedCard';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { cx } from '@shared/lib/utils/cx';
import SubmissionGradeCardUpload from '@admin/pages/Submissions/SubmissionsGrade/SubmissionGradeCardUpload';
import { SubmissionsGradeCardRoboGrades } from '@admin/pages/Submissions/SubmissionsGrade/SubmissionsGradeCardRoboGrades';
import { useSubmissionsGradeCardStyles } from '@admin/pages/Submissions/SubmissionsGrade/SubmissionsGradeCardStyles';
import { CardActionButtons } from './CardActionButtons';
import { OverallGradeBanner } from './OverallGradeBanner';
import { StatusPendingNotesBox } from './StatusPendingNotesBox';
import { SubmissionsGradeCardGrades } from './SubmissionsGradeCardGrades';
import { useAdminOrderItemGradeData } from './useAdminOrderItemGradeData';

interface SubmissionsGradeCardProps {
    itemId: any;
    itemIndex: number;
    notes?: string;
    internalNotes?: string;
    orderID: number;
    gradeData: any;
}

export function SubmissionsGradeCard({
    itemId,
    itemIndex,
    orderID,
    gradeData,
    notes,
    internalNotes,
}: SubmissionsGradeCardProps) {
    const classes = useSubmissionsGradeCardStyles();
    const search = useLocation().search;
    const reviseGradeItemId = new URLSearchParams(search).get('item_id');
    const orderItemGradeData = useAdminOrderItemGradeData(itemIndex, orderID, gradeData, notes, internalNotes);

    return (
        <AccordionCardItem variant={'outlined'}>
            <AccordionCardItemHeader
                heading={orderItemGradeData.cardName}
                image={orderItemGradeData.cardImage}
                expand={parseInt(reviseGradeItemId as string) === itemId}
                subheading={orderItemGradeData.cardFullName}
                shortName={orderItemGradeData.shortName}
                action={
                    <Button disabled variant={'outlined'} className={cx(classes.statusButton, classes.disabledButton)}>
                        {orderItemGradeData.cardStatus}
                    </Button>
                }
            >
                <Grid container direction={'column'}>
                    <Typography variant={'subtitle2'} className={classes.certificateNumberText}>
                        Certificate Number:{' '}
                        <span className={classes.certificateNumberItself}>{orderItemGradeData.certificateNumber}</span>
                    </Typography>
                    {orderItemGradeData.gradedAt && orderItemGradeData.gradedBy ? (
                        <Typography variant={'subtitle2'} className={classes.lastGradedText}>
                            Last Graded:{' '}
                            <span className={classes.lastGradedTime}>
                                {formatDate(orderItemGradeData.gradedAt, 'MM/DD/YYYY')} at{' '}
                                {formatDate(orderItemGradeData.gradedAt, 'H:M')}
                            </span>{' '}
                            ({orderItemGradeData.gradedBy})
                        </Typography>
                    ) : null}
                </Grid>

                <CardActionButtons
                    itemIndex={itemIndex}
                    orderID={orderID}
                    gradeData={gradeData}
                    notes={notes}
                    internalNotes={internalNotes}
                />
            </AccordionCardItemHeader>

            <AccordionCardItemContent>
                {orderItemGradeData.cardStatus.toLowerCase() === 'not accepted' ||
                orderItemGradeData.cardStatus.toLowerCase() === 'missing' ? (
                    <>
                        {orderItemGradeData.currentViewMode === 'not_accepted_pending_notes' ||
                        orderItemGradeData.currentViewMode === 'missing_pending_notes' ? null : (
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
                            </OutlinedCard>
                        )}
                    </>
                ) : null}

                <OverallGradeBanner
                    itemIndex={itemIndex}
                    orderID={orderID}
                    gradeData={gradeData}
                    notes={notes}
                    internalNotes={internalNotes}
                />

                <StatusPendingNotesBox
                    itemIndex={itemIndex}
                    orderID={orderID}
                    gradeData={gradeData}
                    notes={notes}
                    internalNotes={internalNotes}
                />

                {orderItemGradeData.cardStatus.toLowerCase() !== 'missing' &&
                orderItemGradeData.cardStatus.toLowerCase() !== 'not accepted' ? (
                    <>
                        {orderItemGradeData.currentViewMode === 'not_accepted_pending_notes' ||
                        orderItemGradeData.currentViewMode === 'missing_pending_notes' ? null : (
                            <>
                                <TextField
                                    label="Notes to Customer"
                                    multiline
                                    rows={4}
                                    value={orderItemGradeData.cardNotes}
                                    sx={{ marginTop: '16px' }}
                                    fullWidth
                                    onChange={orderItemGradeData.handleNotesChange}
                                />
                                <SubmissionsGradeCardGrades
                                    icon={<FaceIcon className={classes.headingIcon} />}
                                    disabled={!orderItemGradeData.areRoboGradesAvailable()}
                                    itemIndex={itemIndex}
                                    orderID={orderID}
                                    heading={`Enhanced Robogrades`}
                                />
                                <SubmissionsGradeCardRoboGrades
                                    heading={'Robogrades'}
                                    itemIndex={itemIndex}
                                    icon={<OutlinedToyIcon className={classes.headingIcon} />}
                                />
                                <SubmissionGradeCardUpload itemIndex={itemIndex} />
                                <TextField
                                    label="Internal Notes"
                                    multiline
                                    rows={4}
                                    value={orderItemGradeData?.cardInternalNotes}
                                    sx={{ marginTop: '16px' }}
                                    fullWidth
                                    onChange={orderItemGradeData.handleInternalNotesChange}
                                />
                                <Grid container justifyContent={'flex-end'}>
                                    {orderItemGradeData.currentViewMode === 'graded_revise_mode' ? (
                                        <>
                                            <Button
                                                variant={'contained'}
                                                disableElevation
                                                disabled={orderItemGradeData.isDoneDisabled}
                                                onClick={orderItemGradeData.handleCancel}
                                                className={classes.submitButton}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant={'contained'}
                                                disableElevation
                                                disabled={orderItemGradeData.isReviseGradedSaveBtnDisabled()}
                                                color={'primary'}
                                                onClick={orderItemGradeData.handleGradedReviseModeSave}
                                                className={classes.submitButton}
                                            >
                                                Done
                                            </Button>
                                        </>
                                    ) : null}

                                    {orderItemGradeData.currentViewMode === 'confirmed' ? (
                                        <Button
                                            variant={'contained'}
                                            disableElevation
                                            disabled={orderItemGradeData.isOverallDoneDisabled()}
                                            color={'primary'}
                                            onClick={orderItemGradeData.handleDoneBtn}
                                            className={classes.submitButton}
                                        >
                                            Done
                                        </Button>
                                    ) : null}
                                </Grid>
                            </>
                        )}
                    </>
                ) : null}
            </AccordionCardItemContent>
        </AccordionCardItem>
    );
}

export default SubmissionsGradeCard;
