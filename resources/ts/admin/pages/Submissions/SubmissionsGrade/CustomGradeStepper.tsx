import React, { useCallback, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ButtonBase from '@mui/material/ButtonBase';


interface CustomGradeStepperProps {
    orderId: number;
    orderItemId: number;
    currentGrade: number;
    gradeDelta: number;
}

enum GradeOperations {
    Increase,
    Decrease,
}

// Configs
const HIGHEST_CARD_GRADE_LIMIT = 10;
const LOWEST_CARD_GRADE_LIMIT = 1;
const STEPS_VALUE = 0.5;

const useStyles = makeStyles(
    () => ({
        paperContainer: {
            display: 'flex',
            flexDirection: 'row',
            padding: '8px',
            minWidth: '217px',
        },
        gradeDeltaContainer: {
            padding: '8px',
            minWidth: '80px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }),
    { name: 'CustomGradeStepper' },
);

function CustomGradeStepper(props: CustomGradeStepperProps) {
    const classes = useStyles();

    // Difference between the original grade and the grade that was modified by an admin.
    // Example: If the current grade is 8 and gradeDelta is -2, it means the initial grade was 10 and the admin reduced it by 2 points.
    // Resulting in a new grade of 8, from an original grade of 10, and a gradeDelta of -2.
    const [gradeDelta, setGradeDelta] = useState<number>(props.gradeDelta);

    const handleGradeChange = useCallback(
        (operation: GradeOperations) => {
            return () => {
                // Allow admin to increase the grade only if it won't go higher than the set limit
                // We do this by computing the future grade and checking if is going to be lower or equal to the higher limit
                if (
                    operation === GradeOperations.Increase &&
                    props.currentGrade + STEPS_VALUE <= HIGHEST_CARD_GRADE_LIMIT
                ) {
                    setGradeDelta((prevState) => prevState + STEPS_VALUE);
                }
                // Allow admin to decrease the grade only if it won't go lower than the lower limit
                // We do this by computing the future grade and checking if it is going to be higher or equal to the lower limit
                if (
                    operation === GradeOperations.Decrease &&
                    props.currentGrade - STEPS_VALUE >= LOWEST_CARD_GRADE_LIMIT
                ) {
                    setGradeDelta((prevState) => prevState - STEPS_VALUE);
                }
            };
        },
        [gradeDelta, props.currentGrade],
    );

    return (
        <Box flexDirection={'column'} maxWidth={'218px'}>
            <Typography variant={'subtitle1'} fontWeight={'bold'}>
                Change Overall Grade Score
            </Typography>
            <Box className={classes.paperContainer}>
                <Paper className={classes.gradeDeltaContainer} variant={'outlined'}>
                    <Typography variant={'h4'} fontWeight={'bold'}>
                        {gradeDelta > 0 ? '+' : null}
                        {gradeDelta}
                    </Typography>
                </Paper>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    minHeight={'46px'}
                    marginLeft={'16px'}
                >
                    <ButtonBase onClick={handleGradeChange(GradeOperations.Increase)}>
                        <ArrowDropUpIcon />
                    </ButtonBase>
                    <ButtonBase onClick={handleGradeChange(GradeOperations.Decrease)}>
                        <ArrowDropDownIcon />
                    </ButtonBase>
                </Box>
            </Box>
        </Box>
    );
}

export default CustomGradeStepper;
