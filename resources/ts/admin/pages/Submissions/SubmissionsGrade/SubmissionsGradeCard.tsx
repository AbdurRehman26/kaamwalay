import FaceIcon from '@mui/icons-material/Face';
import { Paper } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as OutlinedToyIcon } from '@shared/assets/icons/optimisedSmartToyIcon.svg';
import {
    AccordionCardItem,
    AccordionCardItemHeader,
    AccordionCardItemContent,
} from '@shared/components/AccordionCardItem';
import OutlinedCard from '@shared/components/OutlinedCard';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { cx } from '@shared/lib/utils/cx';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { APIService } from '@shared/services/APIService';
import SubmissionGradeCardUpload from '@admin/pages/Submissions/SubmissionsGrade/SubmissionGradeCardUpload';
import { SubmissionsGradeCardRoboGrades } from '@admin/pages/Submissions/SubmissionsGrade/SubmissionsGradeCardRoboGrades';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import {
    resetCardViewMode,
    updateCardViewMode,
    updateExistingCardData,
    updateExistingCardStatus,
} from '@admin/redux/slices/submissionGradeSlice';
import { SubmissionsGradeCardGrades } from './SubmissionsGradeCardGrades';
import { changeOrderItemNotes } from '@shared/redux/slices/adminOrdersSlice';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import CustomGradeStepper from '@admin/pages/Submissions/SubmissionsGrade/CustomGradeStepper';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import ButtonBase from '@mui/material/ButtonBase';
interface SubmissionsGradeCardProps {
    itemId: any;
    itemIndex: number;
    notes?: string;
    orderID: number;
    gradeData: any;
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
            maxHeight: '123px',
            marginTop: '24px',
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
        lastGradedText: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
            marginTop: '8px',
        },
        lastGradedTime: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        certificateNumberText: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
            marginTop: '6px',
        },
        certificateNumberItself: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
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
export function SubmissionsGradeCard({ itemId, itemIndex, orderID, gradeData, notes }: SubmissionsGradeCardProps) {
    const classes = useStyles();
    const apiService = useInjectable(APIService);
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const [cardNotes, setCardNotes] = useState(notes);
    // Condition here as initial state should be wether gradeDelta is not 0.
    const [showEditGradeStepper, setShowEditGradeStepper] = useState(false);
    const search = useLocation().search;
    const reviseGradeItemId = new URLSearchParams(search).get('item_id');
    const debounceNotes = useCallback(_.debounce(handleUpdateCardNotes, 500), []);

    const handleNotesChange = (event: any) => {
        setCardNotes(event.target.value);
        debounceNotes(itemId, event.target.value);
    };

    const handleNotAccepted = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(updateCardViewMode({ viewModeName: 'not_accepted_pending_notes', viewModeIndex: itemIndex }));
        },
        [dispatch, itemIndex],
    );

    const handleGradeEditPress = useCallback(() => {
        setShowEditGradeStepper((prev) => !prev);
    }, [showEditGradeStepper]);

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
        [dispatch, itemIndex],
    );

    const handleEdit = useCallback(() => {
        dispatch(
            manageCardDialogActions.editCard({
                card: gradeData?.orderItem?.cardProduct,
                declaredValue: gradeData?.orderItem?.declaredValuePerUnit,
                orderItemId: itemId,
            }),
        );
    }, [dispatch, gradeData, itemId]);

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
            notifications.info(`Card was marked as ${newCardStatus}`, 'Warning');
        } catch (err) {}
    };

    async function handleDoneBtn() {
        if (overallGrade !== 0) {
            const DTO = {
                status: 'graded',
            };
            const endpoint = apiService.createEndpoint(`admin/orders/${orderID}/items/${orderItemID}/change-status`);
            const response = await endpoint.post('', DTO);
            dispatch(updateExistingCardStatus({ status: response.data.status.orderItemStatus.name, id: topLevelID }));
        }
        notifications.success('Card graded successfully!.', 'Success');
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
            humanGradeValues: humanGrades,
            gradeDelta: gradeDeltaValues,
        });
        dispatch(updateExistingCardData({ id: topLevelID, data: response.data }));
    }

    function handleGradedReviseModeSave() {
        sendHumanGradesToBackend();
        dispatch(resetCardViewMode({ viewModeIndex: itemIndex, topLevelID: topLevelID }));
    }

    const humanGrades = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex]?.humanGradeValues,
    );
    const gradeDeltaValues = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].gradeDelta,
    );

    const orderItemID = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.id);
    const topLevelID = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].id);
    const cardName = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.cardProduct.name,
    );
    const cardImage = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.cardProduct.imagePath,
    );
    const cardFullName = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.cardProduct.longName,
    );
    const certificateNumber = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.certificateNumber,
    );
    const shortName = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.cardProduct.shortName,
    );
    const overallGrade = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].grade.grade);
    const overallGradeNickname = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].grade.nickname,
    );
    const overallEdgeGrade = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].overallValues.edge,
    );
    const overallCenterGrade = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].overallValues.center,
    );
    const overallCornerGrade = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].overallValues.corner,
    );
    const overallSurfaceGrade = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].overallValues.surface,
    );
    const cardStatus = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.status?.orderItemStatus?.name ?? '',
    );

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

    const gradedAt = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.gradedAt,
    );
    const gradedBy = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.gradedBy,
    );

    function areRoboGradesAvailable() {
        // return roboGradesFront !== null && roboGradesBack !== null;

        // Commented out the above condition for a hotfix in order to display
        // human grades all the time. In the future, if we'll need to conditionally enable them
        // we'll only bring back the values from the slice & uncomment the line above ;)
        return true;
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
        const prevHumanGrades = viewModes[itemIndex].prevViewModeGraded.humanGradeValues;
        if (!isOverallDoneDisabled()) {
            return JSON.stringify(prevHumanGrades) === JSON.stringify(humanGrades);
        } else {
            return true;
        }
    }

    function handleUpdateCardNotes(orderItemId: number, notes: string) {
        dispatch(
            changeOrderItemNotes({
                orderItemId,
                orderId: orderID,
                notes,
            }),
        );
    }

    function isOverallGradeBtnVisible() {
        return (
            frontCentering > 0 &&
            frontEdge > 0 &&
            frontCorner > 0 &&
            frontSurface > 0 &&
            backCenter > 0 &&
            backEdge > 0 &&
            backCorner > 0 &&
            backSurface > 0 &&
            areRoboGradesAvailable()
        );
    }

    return (
        <AccordionCardItem variant={'outlined'}>
            <AccordionCardItemHeader
                heading={cardName}
                image={cardImage}
                expand={parseInt(reviseGradeItemId as string) === itemId}
                subheading={cardFullName}
                shortName={shortName}
                action={
                    <Button disabled variant={'outlined'} className={cx(classes.statusButton, classes.disabledButton)}>
                        {cardStatus}
                    </Button>
                }
            >
                <Grid container direction={'column'}>
                    <Typography variant={'subtitle2'} className={classes.certificateNumberText}>
                        Certificate Number: <span className={classes.certificateNumberItself}>{certificateNumber}</span>
                    </Typography>
                    {gradedAt && gradedBy ? (
                        <Typography variant={'subtitle2'} className={classes.lastGradedText}>
                            Last Graded:{' '}
                            <span className={classes.lastGradedTime}>
                                {formatDate(gradedAt, 'MM/DD/YYYY')} at {formatDate(gradedAt, 'H:M')}
                            </span>{' '}
                            ({gradedBy})
                        </Typography>
                    ) : null}
                </Grid>
                <Grid container className={classes.actions}>
                    {cardStatus.toLowerCase() === 'confirmed' ||
                    ['not_accepted_pending_notes', 'missing_pending_notes', 'graded_revise_mode'].includes(
                        currentViewMode,
                    ) ? (
                        <>
                            <Grid item xs>
                                <Button
                                    variant={'contained'}
                                    color={'inherit'}
                                    onClick={handleNotAccepted}
                                    className={classes.button}
                                >
                                    Not Accepted
                                </Button>
                                <Button
                                    variant={'contained'}
                                    color={'inherit'}
                                    onClick={handleMissing}
                                    className={classes.button}
                                >
                                    Missing
                                </Button>
                                <Button
                                    variant={'contained'}
                                    color={'inherit'}
                                    onClick={handleEdit}
                                    className={classes.button}
                                >
                                    Edit Card
                                </Button>
                            </Grid>
                        </>
                    ) : null}

                    {cardStatus.toLowerCase() !== 'confirmed' &&
                    !['not_accepted_pending_notes', 'missing_pending_notes', 'graded_revise_mode'].includes(
                        currentViewMode,
                    ) ? (
                        <Grid item xs>
                            <Button
                                variant={'contained'}
                                color={'inherit'}
                                onClick={handleRevisePress}
                                className={classes.button}
                            >
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
                            <Box display={'flex'} flexDirection={'row'}>
                                <div className={classes.gradeDetailsContainer}>
                                    <Paper variant={'outlined'} className={classes.gradeItemSingular}>
                                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                            <Typography variant={'h5'} className={classes.gradeItemLabel}>
                                                Overall Grade
                                            </Typography>
                                            {isOverallGradeBtnVisible() ? (
                                                <ButtonBase onClick={handleGradeEditPress} sx={{ marginLeft: '8px' }}>
                                                    <EditIcon sx={{ width: '24px', height: '24px' }} />
                                                </ButtonBase>
                                            ) : null}
                                        </Box>
                                        <div className={classes.overallGradeTextContainer}>
                                            <Typography variant={'h5'} className={classes.gradeItemValue}>
                                                {overallGrade !== 0 ? overallGrade : '-'}
                                            </Typography>
                                            <Typography variant={'h5'} className={classes.gradeNickname}>
                                                {overallGrade !== 0 ? overallGradeNickname : '-'}
                                            </Typography>
                                        </div>
                                        {showEditGradeStepper || gradeDeltaValues !== 0 ? (
                                            <CustomGradeStepper
                                                orderID={orderID}
                                                currentGrade={overallGrade}
                                                gradeDelta={gradeDeltaValues}
                                                itemIndex={itemIndex}
                                            />
                                        ) : null}
                                    </Paper>
                                </div>
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
                            </Box>
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
                                    <TextField
                                        label="Enter Notes"
                                        multiline
                                        rows={4}
                                        value={cardNotes}
                                        sx={{ marginTop: '16px' }}
                                        fullWidth
                                        onChange={handleNotesChange}
                                    />
                                ) : (
                                    <TextField
                                        label="Enter Notes"
                                        multiline
                                        rows={4}
                                        value={cardNotes}
                                        sx={{ marginTop: '16px' }}
                                        fullWidth
                                        onChange={handleNotesChange}
                                    />
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
                            <TextField
                                label="Enter Notes"
                                multiline
                                rows={4}
                                value={cardNotes}
                                sx={{ marginTop: '16px' }}
                                fullWidth
                                onChange={handleNotesChange}
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
                                    disabled={!areRoboGradesAvailable()}
                                    itemIndex={itemIndex}
                                    orderID={orderID}
                                    heading={`Enhanced Robogrades`}
                                />
                                <SubmissionsGradeCardRoboGrades
                                    heading={'Robogrades'}
                                    itemIndex={itemIndex}
                                    icon={<OutlinedToyIcon className={classes.headingIcon} />}
                                />
                                <TextField
                                    label="Enter Notes"
                                    multiline
                                    rows={4}
                                    value={cardNotes}
                                    sx={{ marginTop: '16px' }}
                                    fullWidth
                                    onChange={handleNotesChange}
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
