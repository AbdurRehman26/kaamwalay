import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FaceIcon from '@material-ui/icons/Face';
import React, { useCallback, useEffect, useState } from 'react';
import {
    AccordionCardItem,
    AccordionCardItemHeader,
    AccordionCardItemContent,
} from '@shared/components/AccordionCardItem';
import OutlinedCard from '@shared/components/OutlinedCard';
import { useInjectable } from '@shared/hooks/useInjectable';
import { cx } from '@shared/lib/utils/cx';
import { APIService } from '@shared/services/APIService';
import SubmissionGradeCardUpload from '@admin/pages/Submissions/SubmissionsGrade/SubmissionGradeCardUpload';
import { SubmissionsGradeCardRoboGrades } from '@admin/pages/Submissions/SubmissionsGrade/SubmissionsGradeCardRoboGrades';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import {
    handleActionNotesInput,
    resetCardViewMode,
    updateCardViewMode,
    updateExistingCardData,
    updateExistingCardStatus,
} from '@admin/redux/slices/submissionGradeSlice';
import { SubmissionsGradeCardGrades } from './SubmissionsGradeCardGrades';

interface SubmissionsGradeCardProps {
    cardData: any;
    itemId: any;
    itemIndex: number;
    orderID: number;
    onNotAccepted(itemId: number): void;
    onMissing(itemId: number): void;
}

const useStyles = makeStyles(
    (theme) => ({
        button: {
            marginRight: theme.spacing(1),
        },
        actions: {
            marginTop: theme.spacing(2.5),
        },
        headingIcon: {
            opacity: 0.54,
        },
        gradeDetailsContainer: {
            display: 'flex',
            flexDirection: 'row',
            marginTop: '24px',
        },
        gradeItem: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
        },
        gradeItemSingular: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            minWidth: '216px',
        },
        gradeSection: {
            marginLeft: '24px',
            display: 'flex',
            flexDirection: 'row',
        },
        gradeSectionLarge: {
            marginLeft: '12px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        gradeItemLabel: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        gradeItemLabelSecondary: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            display: 'flex',
            alignItems: 'flex-end',
            textAlign: 'center',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        gradeItemValueSecondary: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '20px',
            lineHeight: '30px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        overallGradeTextContainer: {
            display: 'flex',
            flexDirection: 'row',
        },
        gradeItemValue: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '36px',
            lineHeight: '48px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        gradeNickname: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '48px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        cardViewModeActionsContainer: {
            marginTop: '24px',
        },
        noteActionsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
            marginTop: '12px',
        },
        statusButton: {},
        disabledButton: {},
        submitButton: {
            marginTop: theme.spacing(1.5),
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(1),
        },
        noNotesContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        existingNotesContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        existingNotesTitle: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'center',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        existingNotesDescription: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            textAlign: 'center',
            marginTop: '12px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        noNotesTitle: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'center',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        noNotesDescription: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            textAlign: 'center',
            marginTop: '12px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
    }),
    { name: 'SubmissionsGradeCard' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionsGradeCard
 * @date: 28.08.2021
 * @time: 19:09
 */
export function SubmissionsGradeCard({
    itemId,
    itemIndex,
    orderID,
    onNotAccepted,
    onMissing,
}: SubmissionsGradeCardProps) {
    const classes = useStyles();
    const apiService = useInjectable(APIService);
    const dispatch = useAppDispatch();

    const handleNotAccepted = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(updateCardViewMode({ viewModeName: 'not_accepted_pending_notes', viewModeIndex: itemIndex }));
        },
        [onNotAccepted, itemId],
    );

    const handleRevisePress = () => {
        if (cardStatus.toLowerCase() === 'not accepted') {
            dispatch(updateCardViewMode({ viewModeName: 'not_accepted_pending_notes', viewModeIndex: itemIndex }));
        }

        if (cardStatus.toLowerCase() === 'missing') {
            dispatch(updateCardViewMode({ viewModeName: 'missing_pending_notes', viewModeIndex: itemIndex }));
        }

        if (cardStatus.toLowerCase() === 'graded') {
            dispatch(updateCardViewMode({ viewModeName: 'graded_revise_mode', viewModeIndex: itemIndex }));
        }
    };

    const handleMissing = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(updateCardViewMode({ viewModeName: 'missing_pending_notes', viewModeIndex: itemIndex }));
        },
        [onMissing, itemId],
    );

    const handleCancel = () => {
        dispatch(resetCardViewMode({ viewModeIndex: itemIndex, topLevelID: topLevelID }));
    };

    const handleNotesDonePress = async () => {
        const DTO = {
            status: viewModes[itemIndex]?.name === 'missing_pending_notes' ? 'missing' : 'not_accepted',
            notes: viewModes[itemIndex]?.notes,
        };

        const endpoint = apiService.createEndpoint(`admin/orders/${orderID}/items/${orderItemID}/change-status`);

        try {
            await endpoint.post('', DTO);
            const newCardStatus = viewModes[itemIndex]?.name === 'missing_pending_notes' ? 'Missing' : 'Not Accepted';
            dispatch(updateExistingCardStatus({ status: newCardStatus, id: topLevelID }));
        } catch (err) {}
    };

    async function handleDoneBtn() {
        if (overallGrade !== 0) {
            const DTO = {
                status: 'graded',
            };
            const endpoint = apiService.createEndpoint(`admin/orders/${orderID}/items/${orderItemID}/change-status`);
            const response = await endpoint.post('', DTO);
            dispatch(updateExistingCardStatus({ status: response.data.status.name, id: topLevelID }));
        }
    }

    async function handleActionNotesChange(e: any) {
        dispatch(handleActionNotesInput({ viewModeIndex: itemIndex, notes: e.target.value }));
    }

    function isNotesDoneBtnDisabled() {
        if (viewModes[itemIndex].areNotesRequired) {
            return viewModes[itemIndex].notes === '';
        } else {
            return false;
        }
    }

    async function sendHumanGradesToBackend() {
        const endpoint = apiService.createEndpoint(`admin/orders/${orderID}/cards/${topLevelID}/grades`);
        const response = await endpoint.put('', {
            human_grade_values: humanGrades,
        });
        dispatch(updateExistingCardData({ id: topLevelID, data: response.data }));
    }

    function handleGradedReviseModeSave() {
        sendHumanGradesToBackend();
        dispatch(resetCardViewMode({ viewModeIndex: itemIndex, topLevelID: topLevelID }));
    }

    const humanGrades = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex]?.human_grade_values,
    );

    const orderItemID = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].order_item.id);
    const topLevelID = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].id);
    const cardName = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].order_item.card_product.name,
    );
    const cardImage = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].order_item.card_product.image_path,
    );
    const cardFullName = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].order_item.card_product.full_name,
    );
    const certificateNumber = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].order_item.certificate_number,
    );
    const overallGrade = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].grade.grade);
    const overallGradeNickname = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].grade.nickname,
    );
    const overallEdgeGrade = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].overall_values.edge,
    );
    const overallCenterGrade = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].overall_values.center,
    );
    const overallCornerGrade = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].overall_values.corner,
    );
    const overallSurfaceGrade = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].overall_values.surface,
    );
    const cardStatus = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].order_item.status.order_item_status.name,
    );

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

    const [isDoneDisabled, setIsDoneDisabled] = useState(true);

    const viewModes = useAppSelector((state) => state.submissionGradesSlice.viewModes);
    const currentViewMode = useAppSelector((state) => state.submissionGradesSlice.viewModes[itemIndex]?.name);

    useEffect(() => {
        if (overallGrade !== 0) {
            setIsDoneDisabled(false);
        } else {
            setIsDoneDisabled(true);
        }
    }, [overallGrade]);

    const roboGradesFront = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].robo_grade_values.front,
    );
    const roboGradesBack = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].robo_grade_values.back,
    );

    function areRoboGradesAvailable() {
        return roboGradesFront !== null && roboGradesBack !== null;
    }

    function isOverallDoneDisabled() {
        return !(
            frontCentering !== 0 &&
            frontEdge !== 0 &&
            frontCorner !== 0 &&
            frontSurface !== 0 &&
            backCenter !== 0 &&
            backEdge !== 0 &&
            backCorner !== 0 &&
            backSurface !== 0 &&
            areRoboGradesAvailable()
        );
    }

    function isReviseGradedSaveBtnDisabled() {
        const prevHumanGrades = viewModes[itemIndex].prevViewModeGraded.human_grade_values;
        if (!isOverallDoneDisabled()) {
            return JSON.stringify(prevHumanGrades) === JSON.stringify(humanGrades);
        } else {
            return true;
        }
    }

    return (
        <AccordionCardItem variant={'outlined'}>
            <AccordionCardItemHeader
                heading={cardName}
                image={cardImage}
                subheading={
                    <>
                        {cardFullName}
                        <br />
                        Certificate Number: {certificateNumber}
                    </>
                }
                action={
                    <Button disabled variant={'outlined'} className={cx(classes.statusButton, classes.disabledButton)}>
                        {cardStatus}
                    </Button>
                }
            >
                <Grid container className={classes.actions}>
                    {cardStatus.toLowerCase() === 'confirmed' ? (
                        <>
                            <Grid item xs>
                                <Button variant={'contained'} onClick={handleNotAccepted} className={classes.button}>
                                    Not Accepted
                                </Button>
                                <Button variant={'contained'} onClick={handleMissing} className={classes.button}>
                                    Missing
                                </Button>
                                <Button variant={'contained'} onClick={() => ''} className={classes.button}>
                                    Edit Card
                                </Button>
                            </Grid>
                        </>
                    ) : null}

                    {cardStatus.toLowerCase() !== 'confirmed' ? (
                        <Grid item xs>
                            <Button variant={'contained'} onClick={handleRevisePress} className={classes.button}>
                                Revise
                            </Button>
                        </Grid>
                    ) : null}
                </Grid>
            </AccordionCardItemHeader>

            <AccordionCardItemContent>
                {cardStatus.toLowerCase() === 'confirmed' || cardStatus.toLowerCase() === 'graded' ? (
                    <>
                        {currentViewMode === 'not_accepted_pending_notes' ||
                        currentViewMode === 'missing_pending_notes' ? null : (
                            <div className={classes.gradeDetailsContainer}>
                                <Paper variant={'outlined'} className={classes.gradeItemSingular}>
                                    <Typography variant={'h5'} className={classes.gradeItemLabel}>
                                        Overall Grade
                                    </Typography>
                                    <div className={classes.overallGradeTextContainer}>
                                        <Typography variant={'h5'} className={classes.gradeItemValue}>
                                            {overallGrade !== 0 ? overallGrade : '-'}
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeNickname}>
                                            {overallGrade !== 0 ? overallGradeNickname : '-'}
                                        </Typography>
                                    </div>
                                </Paper>

                                <Paper variant={'outlined'} className={classes.gradeSectionLarge}>
                                    <div className={classes.gradeItem}>
                                        <Typography variant={'h5'} className={classes.gradeItemLabelSecondary}>
                                            Centering
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeItemLabelSecondary}>
                                            (Overall)
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeItemValueSecondary}>
                                            {overallCenterGrade !== 0 ? overallCenterGrade : '-'}
                                        </Typography>
                                    </div>

                                    <div className={classes.gradeItem}>
                                        <Typography variant={'h5'} className={classes.gradeItemLabelSecondary}>
                                            Surface
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeItemLabelSecondary}>
                                            (Overall)
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeItemValueSecondary}>
                                            {overallSurfaceGrade !== 0 ? overallSurfaceGrade : '-'}
                                        </Typography>
                                    </div>

                                    <div className={classes.gradeItem}>
                                        <Typography variant={'h5'} className={classes.gradeItemLabelSecondary}>
                                            Edges
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeItemLabelSecondary}>
                                            (Overall)
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeItemValueSecondary}>
                                            {overallEdgeGrade ? overallEdgeGrade : '-'}
                                        </Typography>
                                    </div>

                                    <div className={classes.gradeItem}>
                                        <Typography variant={'h5'} className={classes.gradeItemLabelSecondary}>
                                            Corners
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeItemLabelSecondary}>
                                            (Overall)
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeItemValueSecondary}>
                                            {overallCornerGrade !== 0 ? overallCornerGrade : '-'}
                                        </Typography>
                                    </div>
                                </Paper>
                            </div>
                        )}
                    </>
                ) : null}

                {cardStatus.toLowerCase() === 'not accepted' || cardStatus.toLowerCase() === 'missing' ? (
                    <>
                        {currentViewMode === 'not_accepted_pending_notes' ||
                        currentViewMode === 'missing_pending_notes' ? null : (
                            <OutlinedCard
                                heading={viewModes[itemIndex]?.sectionTitle}
                                className={classes.cardViewModeActionsContainer}
                            >
                                {(cardStatus.toLowerCase() === 'missing' ||
                                    cardStatus.toLowerCase() === 'not accepted') &&
                                viewModes[itemIndex]?.notes === '' ? (
                                    <div className={classes.noNotesContainer}>
                                        <Typography className={classes.noNotesTitle}>No notes.</Typography>
                                        <Typography className={classes.noNotesDescription}>
                                            No notes have been added. Click “Revise” to add notes.{' '}
                                        </Typography>
                                    </div>
                                ) : (
                                    <div className={classes.existingNotesContainer}>
                                        <Typography className={classes.existingNotesTitle}>Notes: </Typography>
                                        <Typography className={classes.existingNotesDescription}>
                                            {viewModes[itemIndex]?.notes}
                                        </Typography>
                                    </div>
                                )}
                            </OutlinedCard>
                        )}
                    </>
                ) : null}

                {currentViewMode === 'not_accepted_pending_notes' || currentViewMode === 'missing_pending_notes' ? (
                    <>
                        <OutlinedCard
                            heading={viewModes[itemIndex]?.sectionTitle}
                            className={classes.cardViewModeActionsContainer}
                        >
                            <Typography variant={'subtitle2'}>
                                Notes: {viewModes[itemIndex]?.areNotesRequired ? '*' : null}
                            </Typography>
                            <TextField
                                variant={'outlined'}
                                value={viewModes[itemIndex]?.notes}
                                onBlur={() => ''}
                                onChange={handleActionNotesChange}
                                placeholder={viewModes[itemIndex]?.notesPlaceholder}
                                fullWidth
                                multiline
                                disabled={false}
                                rows={3}
                            />
                            <div className={classes.noteActionsContainer}>
                                <Button
                                    variant={'contained'}
                                    disableElevation
                                    onClick={handleCancel}
                                    className={classes.submitButton}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant={'contained'}
                                    disableElevation
                                    disabled={isNotesDoneBtnDisabled()}
                                    color={'primary'}
                                    onClick={handleNotesDonePress}
                                    className={classes.submitButton}
                                >
                                    Done
                                </Button>
                            </div>
                        </OutlinedCard>
                    </>
                ) : null}
                {cardStatus.toLowerCase() !== 'missing' && cardStatus.toLowerCase() !== 'not accepted' ? (
                    <>
                        {currentViewMode === 'not_accepted_pending_notes' ||
                        currentViewMode === 'missing_pending_notes' ? null : (
                            <>
                                <SubmissionsGradeCardGrades
                                    icon={<FaceIcon className={classes.headingIcon} />}
                                    disabled={overallGrade === 0}
                                    itemIndex={itemIndex}
                                    orderID={orderID}
                                    heading={`Human Grades`}
                                />
                                <SubmissionsGradeCardRoboGrades
                                    heading={'Robogrades'}
                                    disabled={!areRoboGradesAvailable()}
                                    itemIndex={itemIndex}
                                    icon={<FaceIcon className={classes.headingIcon} />}
                                />
                                <SubmissionGradeCardUpload itemIndex={itemIndex} />
                                <Grid container justifyContent={'flex-end'}>
                                    {currentViewMode === 'graded_revise_mode' ? (
                                        <>
                                            <Button
                                                variant={'contained'}
                                                disableElevation
                                                disabled={isDoneDisabled}
                                                onClick={handleCancel}
                                                className={classes.submitButton}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant={'contained'}
                                                disableElevation
                                                disabled={isReviseGradedSaveBtnDisabled()}
                                                color={'primary'}
                                                onClick={handleGradedReviseModeSave}
                                                className={classes.submitButton}
                                            >
                                                Done
                                            </Button>
                                        </>
                                    ) : null}

                                    {currentViewMode === 'confirmed' ? (
                                        <Button
                                            variant={'contained'}
                                            disableElevation
                                            disabled={isOverallDoneDisabled()}
                                            color={'primary'}
                                            onClick={handleDoneBtn}
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
