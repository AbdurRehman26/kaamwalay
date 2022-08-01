import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { round } from 'lodash';
import { useCallback, useState } from 'react';
import { UserEntity } from '@shared/entities/UserEntity';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import { CustomerSubmissionListView } from './CustomerSubmissionListView';

interface CustomerDetailProps {
    customerData: UserEntity;
}

const Root = styled(Grid)({
    '.CustomerDetailBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
        padding: '20px',
    },
    '.CustomerDataHeading': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '3px 0px',
    },
    '.CustomerDataValue': {
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

export function CustomerDetail({ customerData }: CustomerDetailProps) {
    const [creditDialog, setCreditDialog] = useState(false);
    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);
    const handleClick = useCallback(() => setCreditDialog(true), []);

    return (
        <>
            <Root container>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                        <div>
                            <Typography className={'CustomerDataHeading'}>Signed Up:</Typography>
                            <Typography className={'CustomerDataHeading'}>Created By:</Typography>
                            <Typography className={'CustomerDataHeading'}>Accessed:</Typography>
                        </div>
                        <div>
                            <Typography className={'CustomerDataValue'}>{customerData.signedUpAt ?? '-'}</Typography>
                            <Typography className={'CustomerDataValue'}>{`Admin(${
                                customerData.createdBy ?? '-'
                            })`}</Typography>
                            <Typography className={'CustomerDataValue'}>
                                {customerData.lastLoginAt ? 'Yes' : 'No'}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <div>
                        <Typography className={'Submissions'}>Submissions</Typography>
                        <Typography className={'TotalSubmissions'}>{customerData?.submissions}</Typography>
                    </div>
                </Grid>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <Grid container>
                        <div>
                            <Typography className={'Wallet'}>Wallet </Typography>
                            <Typography className={'WalletTotalAmount'}>
                                ${round(customerData?.wallet?.balance, 2).toFixed(2)}
                            </Typography>
                        </div>
                        <Grid container item xs justifyContent={'flex-end'}>
                            <AddIcon onClick={handleClick} sx={{ cursor: 'pointer' }} />
                        </Grid>
                    </Grid>
                </Grid>
                <CustomerCreditDialog
                    customer={customerData}
                    wallet={customerData.wallet}
                    open={creditDialog}
                    onClose={handleCreditDialogClose}
                />
            </Root>
            <CustomerSubmissionListView />
        </>
    );
}

export default CustomerDetail;
