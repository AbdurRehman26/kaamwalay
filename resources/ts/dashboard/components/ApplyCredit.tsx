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
        dispatch(
            updatePaymentMethodId({
                id: 1,
            }),
        );
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
        // At first load of the component we define the initial value for the credit input (localAppliedCredit)
        // This way, we set the value for user as per product requirement

        // * appliedCredit is the amount of credit that is applied to the order,
        // but is changed constantly in this component after localAppliedCredit is updated
        // * localAppliedCredit is the state variable that handles the value of the input,
        // its initial value is equals to appliedCredit
        // * availableCredit is the total amount of money that user has available in their wallet
        // * previewTotal is the order total that is being calculated and displayed in order payment summary section

        // If there is an applied credit that is lesser than the available money in wallet, value should remain the same
        if (appliedCredit > 0 && appliedCredit <= availableCredit) {
            return;
        }

        if (availableCredit >= previewTotal) {
            // If user has more money in wallet than what they need to pay in the order
            // input value is set to the order total,
            // meaning that they could fully pay the order using the wallet
            setLocalAppliedCredit(previewTotal);
            return;
        } else {
            // Else, if there is not enough money in wallet to fully pay for the order
            // Set the input value to the total available credit,
            setLocalAppliedCredit(availableCredit);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // * amountPaidFromWallet reflects column of the same name in DB, and it is same as appliedCredit,
        // but it does not change dynamically
        // this means that the real value that was stored in DB for the applied credit is held by this variable

        // After adding amountPaidFromWallet in slice,
        // availableCredit can be fetched after initial useEffect runs.
        // Because of this, we need to hear for possible changes on availableCredit to properly assign the input initial value.
        // This can be modified to assign the amountPaidFromWallet value instead of checking for available credit so we could show alert message.

        // if the order has some previously applied credit and user has money in the wallet
        // set the input value depending on how much was the previously applied credit and how much is available in wallet
        if (amountPaidFromWallet > 0 && availableCredit > 0) {
            if (amountPaidFromWallet < availableCredit) {
                setLocalAppliedCredit(amountPaidFromWallet);
            } else {
                setLocalAppliedCredit(availableCredit);
            }
        }
    }, [availableCredit, amountPaidFromWallet]);

    useEffect(() => {
        // We check for changes on the input to properly display error messages
        // and set the applied credit value in the order

        // If user tries to assign more credit than what they have in wallet, show error and remove applied credit
        if (localAppliedCredit > availableCredit) {
            setInvalidStateType(InvalidStateTypes.exceedsAvailableCredit);
            dispatch(setAppliedCredit(0));
            return;
        }

        // If user tries to assign more credit than what the order total is, show error and remove applied credit
        if (appliedCredit > previewTotal) {
            setInvalidStateType(InvalidStateTypes.exceedsOrderTotal);
            dispatch(setAppliedCredit(0));
            return;
        }

        // If there are no errors, just make the order applied credit same value as the input
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
