import React, { useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import { CircularProgress, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { updateExistingCardData } from '@admin/redux/slices/submissionGradeSlice';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';

interface CustomGradeStepperProps {
    orderID: number;
    currentGrade: number;
    gradeDelta: number;
    itemIndex: number;
}

enum GradeOperations {
    Increase,
    Decrease,
}

// Configs
const HIGHEST_CARD_GRADE_LIMIT = 10;
const LOWEST_CARD_GRADE_LIMIT = 1;
// How much does the grade increase/decrease when the user uses the stepper
const STEPS_VALUE = 0.5;

const useStyles = makeStyles(
    () => ({
        paperContainer: {
            display: 'flex',
            flexDirection: 'column',
            padding: '8px',
        },
        gradeDeltaContainer: {
            padding: '8px',
            minWidth: '80px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        labelFont: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        gradeOperationIcon: { width: '30px', height: '30px' },
    }),
    { name: 'CustomGradeStepper' },
);

function CustomGradeStepper(props: CustomGradeStepperProps) {
    const classes = useStyles();
    const apiService = useInjectable(APIService);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const humanGrades = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[props.itemIndex]?.humanGradeValues,
    );

    const cardID = useAppSelector((state) => state.submissionGradesSlice.allSubmissions[props.itemIndex].id);

    async function updateBackendDelta(newDelta: number) {
        setIsLoading(true);
        const endpoint = apiService.createEndpoint(`admin/orders/${props.orderID}/cards/${cardID}/grades`);
        const response = await endpoint.put('', {
            humanGradeValues: humanGrades,
            gradeDelta: newDelta,
        });
        dispatch(updateExistingCardData({ id: cardID, data: response.data }));
        setIsLoading(false);
    }

    const handleGradeChange = useCallback(
        (operation: GradeOperations) => {
            return async () => {
                // Allow admin to increase the grade only if it won't go higher than the set limit
                // We do this by computing the future grade and checking if is going to be lower or equal to the higher limit
                if (
                    operation === GradeOperations.Increase &&
                    props.currentGrade + STEPS_VALUE <= HIGHEST_CARD_GRADE_LIMIT
                ) {
                    await updateBackendDelta(props.gradeDelta + STEPS_VALUE);
                }
                // Allow admin to decrease the grade only if it won't go lower than the lower limit
                // We do this by computing the future grade and checking if it is going to be higher or equal to the lower limit
                if (
                    operation === GradeOperations.Decrease &&
                    props.currentGrade - STEPS_VALUE >= LOWEST_CARD_GRADE_LIMIT
                ) {
                    await updateBackendDelta(props.gradeDelta - STEPS_VALUE);
                }
            };
        },
        [props.gradeDelta, props.currentGrade],
    );

    return (
        <>
            <Divider sx={{ width: '100%', marginTop: '16px' }}>Override Grade</Divider>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={'8px'}>
                <Box className={classes.paperContainer}>
                    <Paper className={classes.gradeDeltaContainer} variant={'outlined'}>
                        <Typography variant={'h4'} fontWeight={'bold'}>
                            {/* Displaying '+' in front of the delta if it is a positive number.
                            We need this only for positive numbers, because negative numbers come directly with - in front.*/}
                            {props.gradeDelta > 0 ? '+' : null}

                            {props.gradeDelta}
                        </Typography>
                    </Paper>
                    {!isLoading ? (
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} marginTop={'12px'}>
                            <ButtonBase onClick={handleGradeChange(GradeOperations.Decrease)}>
                                <ArrowDropDownIcon className={classes.gradeOperationIcon} />
                            </ButtonBase>
                            <ButtonBase onClick={handleGradeChange(GradeOperations.Increase)}>
                                <ArrowDropUpIcon className={classes.gradeOperationIcon} />
                            </ButtonBase>
                        </Box>
                    ) : (
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            minWidth={'100%'}
                            justifyContent={'center'}
                            marginTop={'8px'}
                        >
                            <CircularProgress color={'primary'} />
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default CustomGradeStepper;
