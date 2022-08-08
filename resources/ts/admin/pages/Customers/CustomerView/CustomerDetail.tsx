import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { round } from 'lodash';
import { useCallback, useState } from 'react';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import { CustomerSubmissionListView } from './CustomerSubmissionListView';

interface CustomerDetailProps {
    customer: CustomerEntity;
    onResend?: any;
}

const Root = styled(Grid)({
    '.CustomerDetailBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
        padding: '20px',
    },
    '.CustomerHeading': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '3px 0px',
    },
    '.CustomerValue': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '3px 0px',
        paddingLeft: '30px',
    },
    '.Submissions': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.TotalSubmissions': {
        fontWeight: 300,
        fontSize: '50px',
        lineHeight: '59px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.Wallet': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.WalletTotalAmount': {
        fontWeight: 300,
        fontSize: '50px',
        lineHeight: '59px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '3px 0px',
    },
});

export function CustomerDetail({ customer, onResend }: CustomerDetailProps) {
    const [creditDialog, setCreditDialog] = useState(false);
    const [resendCall, setResendCall] = useState(false);
    const handleClick = useCallback(() => setCreditDialog(true), []);

    const handleCreditDialogClose = useCallback(() => {
        setCreditDialog(false);
        setResendCall(!resendCall);
        onResend(resendCall);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resendCall]);

    return (
        <>
            <Root container>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                        <div>
                            <Typography className={'CustomerHeading'}>Signed Up:</Typography>
                            <Typography className={'CustomerHeading'}>Created By:</Typography>
                            <Typography className={'CustomerHeading'}>Accessed:</Typography>
                        </div>
                        <div>
                            <Typography className={'CustomerValue'}>
                                {formatDate(customer.createdAt, 'MM/DD/YYYY') ?? '-'}
                            </Typography>
                            <Typography className={'CustomerValue'}>
                                {customer?.createdBy ? `Admin (${customer?.createdBy?.fullName})` : 'User'}
                            </Typography>
                            <Typography className={'CustomerValue'}>{customer.lastLoginAt ? 'Yes' : 'No'}</Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <div>
                        <Typography className={'Submissions'}>Paid Submissions</Typography>
                        <Typography className={'TotalSubmissions'}>{customer?.submissions}</Typography>
                    </div>
                </Grid>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <Grid container>
                        <div>
                            <Typography className={'Wallet'}>Wallet </Typography>
                            <Typography className={'WalletTotalAmount'}>
                                ${round(customer?.wallet?.balance, 2).toFixed(2)}
                            </Typography>
                        </div>
                        <Grid container item xs justifyContent={'flex-end'}>
                            <AddIcon onClick={handleClick} sx={{ cursor: 'pointer' }} />
                        </Grid>
                    </Grid>
                </Grid>
                <CustomerCreditDialog
                    customer={customer}
                    wallet={customer.wallet}
                    open={creditDialog}
                    onClose={handleCreditDialogClose}
                />
            </Root>
            <CustomerSubmissionListView />
        </>
    );
}

export default CustomerDetail;
