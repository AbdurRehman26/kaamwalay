import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FaceIcon from '@material-ui/icons/Face';
import { useCallback, useEffect, useState } from 'react';
import {
    AccordionCardItem,
    AccordionCardItemHeader,
    AccordionCardItemContent,
} from '@shared/components/AccordionCardItem';
import { useInjectable } from '@shared/hooks/useInjectable';
import { cx } from '@shared/lib/utils/cx';
import { APIService } from '@shared/services/APIService';
import SubmissionGradeCardUpload from '@admin/pages/Submissions/SubmissionsGrade/SubmissionGradeCardUpload';
import { SubmissionsGradeCardRoboGrades } from '@admin/pages/Submissions/SubmissionsGrade/SubmissionsGradeCardRoboGrades';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { updateExistingCardStatus } from '@admin/redux/slices/submissionGradeSlice';
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
        statusButton: {},
        disabledButton: {},
        submitButton: {
            marginTop: theme.spacing(2.5),
            marginBottom: theme.spacing(1),
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
            onNotAccepted(itemId);
        },
        [onNotAccepted, itemId],
    );

    const handleMissing = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            onMissing(itemId);
        },
        [onMissing, itemId],
    );

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
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].order_item.status.name,
    );
    const [isDoneDisabled, setIsDoneDisabled] = useState(true);

    useEffect(() => {
        if (overallGrade !== 0) {
            setIsDoneDisabled(false);
        } else {
            setIsDoneDisabled(true);
        }
    }, [overallGrade]);

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
                    <Grid item xs>
                        <Button variant={'contained'} onClick={handleNotAccepted} className={classes.button}>
                            Not Accepted
                        </Button>
                        <Button variant={'contained'} onClick={handleMissing} className={classes.button}>
                            Missing
                        </Button>
                    </Grid>
                    <Grid container item xs justifyContent={'flex-end'}>
                        <TextField size={'small'} variant={'outlined'} value={'1.1'} label={'A.I. Model #'} />
                    </Grid>
                </Grid>
            </AccordionCardItemHeader>

            <AccordionCardItemContent>
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

                <SubmissionsGradeCardGrades
                    icon={<FaceIcon className={classes.headingIcon} />}
                    disabled={overallGrade === 0}
                    itemIndex={itemIndex}
                    orderID={orderID}
                    heading={`Human Grades`}
                />

                <SubmissionsGradeCardRoboGrades
                    heading={'Robogrades'}
                    disabled
                    itemIndex={itemIndex}
                    icon={<FaceIcon className={classes.headingIcon} />}
                />
                <SubmissionGradeCardUpload itemIndex={itemIndex} />

                <Grid container justifyContent={'flex-end'}>
                    <Button
                        variant={'contained'}
                        disableElevation
                        disabled={isDoneDisabled}
                        color={'primary'}
                        onClick={handleDoneBtn}
                        className={classes.submitButton}
                    >
                        Done
                    </Button>
                </Grid>
            </AccordionCardItemContent>
        </AccordionCardItem>
    );
}

export default SubmissionsGradeCard;
