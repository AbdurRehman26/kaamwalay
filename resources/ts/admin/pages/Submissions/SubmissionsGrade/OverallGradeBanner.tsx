import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import CustomGradeStepper from '@admin/pages/Submissions/SubmissionsGrade/CustomGradeStepper';
import { useSubmissionsGradeCardStyles } from './SubmissionsGradeCardStyles';
import { useAdminOrderItemGradeData } from './useAdminOrderItemGradeData';

interface Props {
    itemIndex: number;
    orderID: number;
    gradeData?: any;
    notes?: string;
    internalNotes?: string;
}

export function OverallGradeBanner({ itemIndex, orderID, gradeData, notes, internalNotes }: Props) {
    const orderItemGradeData = useAdminOrderItemGradeData(itemIndex, orderID, gradeData, notes, internalNotes);
    const classes = useSubmissionsGradeCardStyles();

    const isCardConfirmedOrGraded = useMemo(() => {
        return (
            orderItemGradeData.cardStatus.toLowerCase() === 'confirmed' ||
            orderItemGradeData.cardStatus.toLowerCase() === 'graded'
        );
    }, [orderItemGradeData.cardStatus]);

    return (
        <>
            {isCardConfirmedOrGraded ? (
                <>
                    {orderItemGradeData.currentViewMode === 'not_accepted_pending_notes' ||
                    orderItemGradeData.currentViewMode === 'missing_pending_notes' ? null : (
                        <Box display={'flex'} flexDirection={'row'}>
                            <div className={classes.gradeDetailsContainer}>
                                <Paper variant={'outlined'} className={classes.gradeItemSingular}>
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                        <Typography variant={'h5'} className={classes.gradeItemLabel}>
                                            Overall Grade
                                        </Typography>
                                        {orderItemGradeData.isOverallGradeBtnVisible() ? (
                                            <ButtonBase
                                                onClick={orderItemGradeData.handleGradeEditPress}
                                                sx={{ marginLeft: '8px' }}
                                            >
                                                <EditIcon sx={{ width: '24px', height: '24px' }} />
                                            </ButtonBase>
                                        ) : null}
                                    </Box>
                                    <div className={classes.overallGradeTextContainer}>
                                        <Typography variant={'h5'} className={classes.gradeItemValue}>
                                            {orderItemGradeData.overallGrade !== 0
                                                ? orderItemGradeData.overallGrade
                                                : '-'}
                                        </Typography>
                                        <Typography variant={'h5'} className={classes.gradeNickname}>
                                            {orderItemGradeData.overallGrade !== 0
                                                ? orderItemGradeData.overallGradeNickname
                                                : '-'}
                                        </Typography>
                                    </div>
                                    {orderItemGradeData.showEditGradeStepper ||
                                    orderItemGradeData.gradeDeltaValues !== 0 ? (
                                        <CustomGradeStepper
                                            orderID={orderID}
                                            currentGrade={orderItemGradeData.overallGrade}
                                            gradeDelta={orderItemGradeData.gradeDeltaValues}
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
                                        {orderItemGradeData.overallCenterGrade !== 0
                                            ? orderItemGradeData.overallCenterGrade
                                            : '-'}
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
                                        {orderItemGradeData.overallSurfaceGrade !== 0
                                            ? orderItemGradeData.overallSurfaceGrade
                                            : '-'}
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
                                        {orderItemGradeData.overallGrade ? orderItemGradeData.overallEdgeGrade : '-'}
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
                                        {orderItemGradeData.overallCornerGrade !== 0
                                            ? orderItemGradeData.overallCornerGrade
                                            : '-'}
                                    </Typography>
                                </div>
                            </Paper>
                        </Box>
                    )}
                </>
            ) : null}
        </>
    );
}
