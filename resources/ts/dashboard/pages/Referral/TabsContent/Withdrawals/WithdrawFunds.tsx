import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';
import theme from '@shared/styles/theme';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getReferrerDetail } from '@dashboard/redux/slices/referralProgramSlice';

const WithDrawDiv = styled(Grid)({
    background: '#FFFFFF',
    width: '100%',
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
        marginLeft: '0px',
        marginBottom: '15px',
    },

    '.AmountHeading': {
        marginTop: '40px',
        fontWeight: '500',
        fontSize: '20px',
    },
    '.AmountValue': {
        color: theme.palette.primary,
    },
    '.Caption': {
        margin: '3px 0px',
        width: '50%',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        color: 'rgba(0, 0, 0, 0.54)',
        letterSpacing: '0.15px',
    },
    '.AccountInfo': {
        '&:last-child': {
            borderRadius: '0px 0px 4px 4px',
        },
    },
    '.AccountInfoHeading': {
        marginTop: '40px',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
    },
    '.PayoutAccountInfoBox': {
        margin: '5px 0px',
    },
    '.Divider': {
        margin: '5% 0px 2% 0',
    },
    '.WithDrawalBtnDiv': {
        '.Caption': {
            fontSize: '12px !important',
        },
        '.Button': {
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#DDDDDD',
            color: 'rgba(0, 0, 0, 0.24)',
        },
    },
});
export function WithdrawFunds() {
    const [payoutAccount, setPayoutAccount] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const apiService = useInjectable(APIService);
    const dispatch = useAppDispatch();

    const referrer = useAppSelector((state) => state.referralProgramSlice.referrerDetail.referrer);

    useEffect(() => {
        dispatch(getReferrerDetail());
    }, [dispatch]);

    const onPayoutAccountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPayoutAccount(e.target.value);
        setIsDisabled(false);
    }, []);

    const handleSubmit = useCallback(async () => {
        const endpoint = apiService.createEndpoint(`customer/referrer/payouts`, {
            version: 'v3',
        });

        try {
            const response = await endpoint.post('', {
                amount: referrer.withdrawableCommission,
                payoutAccount: payoutAccount,
            });
            console.log(response);
        } catch (error: any) {}
    }, [apiService, payoutAccount, referrer.withdrawableCommission]);

    return (
        <WithDrawDiv>
            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
                <Typography>Referral Program</Typography>
                <Typography>Withdraw Funds</Typography>
            </Breadcrumbs>
            <Grid>
                <Typography className={'AmountHeading'}>
                    Withdrawal Amount: <span className={'AmountValue'}>${referrer.withdrawableCommission}</span>
                </Typography>
                <Typography className={'Caption'}>
                    It can take 5-7 days for the withdrawal to finalize. It will show up as “pending” until it’s
                    completed.
                </Typography>
            </Grid>
            <Grid className={'AccountInfo'}>
                <Typography className={'AccountInfoHeading'}>Payout Account (PayPal)</Typography>
                <Typography className={'Caption'}>
                    Please enter the PayPal email where you would like to be paid out.
                </Typography>
                <TextField
                    className={'PayoutAccountInfoBox'}
                    placeholder="Enter Paypal Email"
                    fullWidth
                    value={payoutAccount}
                    onChange={onPayoutAccountChange}
                    variant={'outlined'}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Typography className={'Caption'}>Don’t have one? Create a PayPal Account</Typography>
            </Grid>
            <Divider className={'Divider'} />
            <Grid className={'WithDrawalBtnDiv'}>
                <Typography className={'Caption'}>
                    Once you start a withdrawal, it can’t be undone. The withdrawal amount will be deducted from your
                    Withdrawable Commission, and you will be able to see the pending transaction in your Withdrawals
                    section. It can take 5-7 days for the funds to transfer to your payout account.
                </Typography>
                <Button disabled={isDisabled} onClick={handleSubmit} className={'Button'}>
                    START WITHDRAWAL
                </Button>
            </Grid>
        </WithDrawDiv>
    );
}

export default WithdrawFunds;
