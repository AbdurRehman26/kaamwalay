import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setAppliedCredit, updatePaymentMethodId } from '@dashboard/redux/slices/newSubmissionSlice';

enum InvalidStateTypes {
    exceedsAvailableCredit,
    exceedsOrderTotal,
}

export function ApplyCredit() {
    const dispatch = useAppDispatch();
    const [invalidStateType, setInvalidStateType] = useState<InvalidStateTypes | null>(null);
    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);
    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);
    const amountPaidFromWallet = useAppSelector((state) => state.newSubmission.amountPaidFromWallet);
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
        // When using paypal, and we update the applied credit, it won't change the applied credit for that user.
        // so here, we are resetting the payment method selection
        dispatch(updatePaymentMethodId(1));
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
        if (appliedCredit > 0 && appliedCredit <= availableCredit) {
            return;
        }

        if (availableCredit >= previewTotal) {
            dispatch(setAppliedCredit(previewTotal));
            setLocalAppliedCredit(previewTotal);
            return;
        }
        if (availableCredit < previewTotal) {
            dispatch(setAppliedCredit(availableCredit));
            setLocalAppliedCredit(availableCredit);
            return;
        }
        if (appliedCredit <= 0) {
            setLocalAppliedCredit(0);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        // After adding amountPaidFromWallet (which is appliedCredit as registered in DB) in slice,
        // availableCredit can be fetched after initial useEffect runs.
        // Because of this, we need to hear for possible changes on availableCredit to properly assign the input initial value.
        // This can be modified to assign the amountPaidFromWallet value instead of checking for available credit so we could show alert message.
        if (amountPaidFromWallet > 0 && availableCredit > 0) {
            if (amountPaidFromWallet < availableCredit) {
                setLocalAppliedCredit(amountPaidFromWallet);
            } else {
                setLocalAppliedCredit(availableCredit);
            }
        }
    }, [availableCredit, amountPaidFromWallet]);

    useEffect(() => {
        if (localAppliedCredit > availableCredit) {
            setInvalidStateType(InvalidStateTypes.exceedsAvailableCredit);
            dispatch(setAppliedCredit(0));
            return;
        }

        if (appliedCredit > previewTotal) {
            setInvalidStateType(InvalidStateTypes.exceedsOrderTotal);
            dispatch(setAppliedCredit(0));
            return;
        }

        setInvalidStateType(null);
        dispatch(setAppliedCredit(localAppliedCredit));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedCredit, localAppliedCredit, availableCredit]);

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
