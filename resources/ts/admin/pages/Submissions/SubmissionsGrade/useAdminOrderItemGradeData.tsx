import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { changeOrderItemNotes } from '@shared/redux/slices/adminOrdersSlice';
import {
    getAllSubmissions,
    markRemoteCardAsGraded,
    rejectCard,
    resetCardViewMode,
    updateCardViewMode,
    updateExistingCardData,
    updateExistingCardStatus,
    updateHumanGradeValue,
    updateRemoteHumanGrades,
} from '@admin/redux/slices/submissionGradeSlice';
import { useNotifications } from '@shared/hooks/useNotifications';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { debounce } from 'lodash';

export function useAdminOrderItemGradeData(
    itemIndex: number,
    orderID: number,
    gradeData?: any,
    notes?: string,
    internalNotes?: string,
) {
    const notifications = useNotifications();
    const dispatch = useAppDispatch();
    const [cardInternalNotes, setInternalNotes] = useState(internalNotes);
    const [cardNotes, setCardNotes] = useState(notes);

    const [showEditGradeStepper, setShowEditGradeStepper] = useState(false);

    const viewModes = useAppSelector((state) => state.submissionGradesSlice.viewModes);
    const currentViewMode = useAppSelector((state) => state.submissionGradesSlice.viewModes[itemIndex]?.name);

    const humanGrades = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex]?.humanGradeValues,
    );
    const gradeDeltaValues = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].gradeDelta,
    );

    const itemID = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[itemIndex].id);

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
    const gradedAt = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.gradedAt,
    );
    const gradedBy = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].orderItem.gradedBy,
    );

    const [isDoneDisabled, setIsDoneDisabled] = useState(true);

    const handleUpdateCardNotes = useCallback(
        (orderItemId: number, notes: string) => {
            dispatch(
                changeOrderItemNotes({
                    orderItemId,
                    orderId: orderID,
                    notes,
                }),
            );
        },
        [dispatch, orderID],
    );

    const handleUpdateInternalCardNotes = useCallback(
        (orderItemId: number, internalNotes: string) => {
            dispatch(
                changeOrderItemNotes({
                    orderItemId,
                    orderId: orderID,
                    internalNotes,
                }),
            );
        },
        [dispatch, orderID],
    );

    const handleNotAccepted = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(updateCardViewMode({ viewModeName: 'not_accepted_pending_notes', viewModeIndex: itemIndex }));
        },
        [dispatch, itemIndex],
    );

    const handleMissing = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(updateCardViewMode({ viewModeName: 'missing_pending_notes', viewModeIndex: itemIndex }));
        },
        [dispatch, itemIndex],
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

    function isNotesDoneBtnDisabled() {
        if (viewModes[itemIndex].areNotesRequired) {
            return viewModes[itemIndex].notes === '';
        } else {
            return false;
        }
    }

    const handleNotesDonePress = async () => {
        const DTO = {
            status: viewModes[itemIndex]?.name === 'missing_pending_notes' ? 'missing' : 'not_accepted',
            notes: viewModes[itemIndex]?.notes,
            orderID,
            orderItemID,
        };
        try {
            await dispatch(rejectCard(DTO)).unwrap();
            const newCardStatus = viewModes[itemIndex]?.name === 'missing_pending_notes' ? 'Missing' : 'Not Accepted';
            dispatch(updateExistingCardStatus({ status: newCardStatus, id: topLevelID }));
            notifications.info(`Card was marked as ${newCardStatus}`, 'Warning');
        } catch (err: any) {
            notifications.exception(err);
        }
    };

    async function sendHumanGradesToBackend() {
        try {
            const response = await dispatch(
                updateRemoteHumanGrades({
                    orderID,
                    topLevelID,
                    humanGradeValues: humanGrades,
                    gradeDelta: 0,
                }),
            ).unwrap();
            dispatch(updateExistingCardData({ id: topLevelID, data: response.data }));
        } catch (error: any) {
            dispatch(getAllSubmissions(orderID));
            notifications.exception(error);
        }
    }

    function handleGradedReviseModeSave() {
        // noinspection JSIgnoredPromiseFromCall
        sendHumanGradesToBackend();
        dispatch(resetCardViewMode({ viewModeIndex: itemIndex, topLevelID: topLevelID }));
    }

    const handleCancel = () => {
        dispatch(resetCardViewMode({ viewModeIndex: itemIndex, topLevelID: topLevelID }));
    };

    const handleEdit = useCallback(() => {
        dispatch(
            manageCardDialogActions.editCard({
                card: gradeData?.orderItem?.cardProduct,
                declaredValue: gradeData?.orderItem?.declaredValuePerUnit,
                orderItemId: orderItemID,
            }),
        );
    }, [dispatch, gradeData, orderItemID]);

    const handleGradeEditPress = useCallback(() => {
        setShowEditGradeStepper((prev) => !prev);
    }, []);

    const debounceNotes = useMemo(() => debounce(handleUpdateCardNotes, 500), [handleUpdateCardNotes]);

    const handleNotesChange = (event: any) => {
        setCardNotes(event.target.value);
        debounceNotes(orderItemID, event.target.value);
    };

    const debounceInternalNotes = useMemo(
        () => debounce(handleUpdateInternalCardNotes, 500),
        [handleUpdateInternalCardNotes],
    );

    const handleInternalNotesChange = (event: any) => {
        setInternalNotes(event.target.value);
        debounceInternalNotes(orderItemID, event.target.value);
    };

    async function handleDoneBtn() {
        if (overallGrade !== 0) {
            const response = await dispatch(
                markRemoteCardAsGraded({
                    status: 'graded',
                    orderID,
                    orderItemID,
                }),
            ).unwrap();
            dispatch(
                updateExistingCardStatus({
                    status: response.data.status.orderItemStatus.name,
                    id: topLevelID,
                }),
            );
        }
        notifications.success('Card graded successfully!.', 'Success');
    }

    useEffect(() => {
        if (overallGrade !== 0) {
            setIsDoneDisabled(false);
        } else {
            setIsDoneDisabled(true);
        }
    }, [overallGrade]);

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

    function isReviseGradedSaveBtnDisabled() {
        const prevHumanGrades = viewModes[itemIndex].prevViewModeGraded.humanGradeValues;
        if (!isOverallDoneDisabled()) {
            return JSON.stringify(prevHumanGrades) === JSON.stringify(humanGrades);
        } else {
            return true;
        }
    }

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

    return {
        handleUpdateInternalCardNotes,
        handleNotAccepted,
        handleGradeEditPress,
        handleInternalNotesChange,
        handleNotesChange,
        handleDoneBtn,
        handleEdit,
        viewModes,
        handleCancel,
        handleGradedReviseModeSave,
        handleNotesDonePress,
        handleRevisePress,
        isNotesDoneBtnDisabled,
        currentViewMode,
        handleMissing,
        handleUpdateCardNotes,
        orderItemID,
        topLevelID,
        cardName,
        cardImage,
        cardFullName,
        certificateNumber,
        shortName,
        overallGrade,
        overallGradeNickname,
        overallEdgeGrade,
        overallCenterGrade,
        overallCornerGrade,
        overallSurfaceGrade,
        cardStatus,
        frontCentering,
        frontEdge,
        frontCorner,
        frontSurface,
        backSurface,
        backEdge,
        backCorner,
        backCenter,
        gradeDeltaValues,
        humanGrades,
        showEditGradeStepper,
        setShowEditGradeStepper,
        cardNotes,
        setCardNotes,
        cardInternalNotes,
        isDoneDisabled,
        gradedAt,
        gradedBy,
        isOverallDoneDisabled,
        isOverallGradeBtnVisible,
        areRoboGradesAvailable,
        isReviseGradedSaveBtnDisabled,
        itemID,
        updateHumanGrade,
        sendHumanGradesToBackend,
    };
}
