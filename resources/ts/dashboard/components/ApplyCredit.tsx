import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setAppliedCredit } from '@dashboard/redux/slices/newSubmissionSlice';
import InputAdornment from '@mui/material/InputAdornment';

enum InvalidStateTypes {
    exceedsAvailableCredit,
    exceedsOrderTotal,
}

export function ApplyCredit() {
    const dispatch = useAppDispatch();
    const [invalidStateType, setInvalidStateType] = useState<InvalidStateTypes | null>(null);
    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);
    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);
    const newSubmission = useAppSelector((state) => state.newSubmission);
    console.log(newSubmission, 111111);
    const [localAppliedCredit, setLocalAppliedCredit] = useState(appliedCredit);
    const previewTotal = useAppSelector((state) => state.newSubmission.previewTotal);

    function onAppliedCreditChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(event.target.value);
        if (!value) {
            dispatch(setAppliedCredit(0));
            setLocalAppliedCredit(0);
            return;
        }
        setLocalAppliedCredit(value);
    }

    const errorMessage = useMemo(() => {
        if (invalidStateType === InvalidStateTypes.exceedsAvailableCredit) {
            return 'Applied credit cannot exceed available credit.';
        }
        if (invalidStateType === InvalidStateTypes.exceedsOrderTotal) {
            return 'Applied credit cannot exceed order total.';
        }

        return '';
    }, [invalidStateType]);

    useEffect(() => {
        if (availableCredit < previewTotal) {
            console.log(2);
            dispatch(setAppliedCredit(availableCredit));
            setLocalAppliedCredit(availableCredit);
            return;
        }
        if (appliedCredit <= 0) {
            console.log(3);
            setLocalAppliedCredit(0);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (localAppliedCredit > availableCredit) {
            setInvalidStateType(InvalidStateTypes.exceedsAvailableCredit);
            console.log(21);
            dispatch(setAppliedCredit(0));
            return;
        }

        if (appliedCredit > previewTotal) {
            console.log(22);
            setInvalidStateType(InvalidStateTypes.exceedsOrderTotal);
            console.log(appliedCredit, previewTotal, 111543);
            dispatch(setAppliedCredit(0));
            return;
        }

        setInvalidStateType(null);
        dispatch(setAppliedCredit(localAppliedCredit));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedCredit, localAppliedCredit]);

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} width={'50%'} marginBottom={'6px'}>
            <Typography variant={'caption'}>Credit Applied</Typography>
            <TextField
                error={invalidStateType !== null}
                onChange={onAppliedCreditChange}
                value={localAppliedCredit}
                size={'small'}
                fullWidth
                sx={{ width: '100%' }}
                onBlur={() => ''}
                helperText={errorMessage}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                placeholder={'Enter credit amount'}
            />
        </Box>
    );
}
