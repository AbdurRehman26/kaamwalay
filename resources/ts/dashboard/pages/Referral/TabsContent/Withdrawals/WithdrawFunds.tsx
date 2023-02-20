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
import { useNotifications } from '@shared/hooks/useNotifications';
import { APIService } from '@shared/services/APIService';
import theme from '@shared/styles/theme';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getReferrerDetail } from '@dashboard/redux/slices/referralProgramSlice';

const WithDrawDiv = styled(Grid)({
    background: '#FFFFFF',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        marginBottom: '15px',
    },

    '.AmountHeading': {
        marginTop: '20px',
        fontWeight: '500',
        fontSize: '20px',
    },
    '.AmountValue': {
        color: '#43A047',
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
        width: '50%',
    },
    '.Divider': {
        margin: '5% 0px 2% 0',
        width: '50%',
    },
    '.WithDrawalBtnDiv': {
        '.Caption': {
            fontSize: '12px !important',
        },
        '.Button': {
            marginTop: '20px',
            padding: '15px 20px',
            backgroundColor: '#20BFB8',
            color: '#FFFFFF',
        },
        '.DisabledButton': {
            marginTop: '20px',
            padding: '15px 20px',
            backgroundColor: '#DDDDDD',
            color: 'rgba(0, 0, 0, 0.24)',
        },
    },
    '.BreadcrumDiv': {
        padding: '10px 0px',
    },
    '.BreadcrumbText': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.BreadcrumbTextHighlighted': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: '#20BFB8',
    },
    '.PayPalLink': {
        color: '#20BFB8',
        textDecoration: 'none',
        fontWeight: 500,
    },
    '.PaymentMethodName': {
        color: 'rgba(0, 0, 0, 0.54)',
        fontWeight: 400,
    },
});
export function WithdrawFunds() {
    const [payoutAccount, setPayoutAccount] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const apiService = useInjectable(APIService);
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const referrer = useAppSelector((state) => state.referralProgramSlice.referrerDetail.referrer);

    useEffect(() => {
        dispatch(getReferrerDetail());
    }, [dispatch]);

    const onPayoutAccountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPayoutAccount(e.target.value);
        if (e.target.value === '' || !e.target.value.match(emailFormat)) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        } catch (error: any) {
            notifications.exception(error);
            return;
        }
    }, [apiService, payoutAccount, referrer.withdrawableCommission, notifications]);

    return (
        <WithDrawDiv>
            <Breadcrumbs className={'BreadcrumDiv'} separator={<NavigateNextIcon fontSize="small" />}>
                <Typography className={'BreadcrumbTextHighlighted'}>Referral Program</Typography>
                <Typography className={'BreadcrumbText'}>Withdraw Funds</Typography>
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
                <Typography className={'AccountInfoHeading'}>
                    Payout Account <span className={'PaymentMethodName'}>(PayPal)</span>
                </Typography>
                <Typography className={'Caption'}>
                    Please enter the PayPal email where you would like to be paid out.
                </Typography>
                <TextField
                    className={'PayoutAccountInfoBox'}
                    placeholder="Enter Paypal Email"
                    value={payoutAccount}
                    onChange={onPayoutAccountChange}
                    variant={'outlined'}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Typography className={'Caption'}>
                    Don’t have one?{' '}
                    <a
                        className={'PayPalLink'}
                        href="https://www.paypal.com/us/webapps/mpp/account-selection"
                        target="_blank" rel="noreferrer"
                    >
                        Create a PayPal Account
                    </a>
                </Typography>
            </Grid>
            <Divider className={'Divider'} />
            <Grid className={'WithDrawalBtnDiv'}>
                <Typography className={'Caption'}>
                    Once you start a withdrawal, it can’t be undone. The withdrawal amount will be deducted from your
                    Withdrawable Commission, and you will be able to see the pending transaction in your Withdrawals
                    section. It can take 5-7 days for the funds to transfer to your payout account.
                </Typography>
                <Button
                    disabled={isDisabled}
                    onClick={handleSubmit}
                    className={isDisabled ? 'DisabledButton' : 'Button'}
                >
                    START WITHDRAWAL
                </Button>
            </Grid>
        </WithDrawDiv>
    );
}

export default WithdrawFunds;
