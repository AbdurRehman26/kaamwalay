import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OptionsMenu, OptionsMenuItem } from '@shared/components/OptionsMenu';
import { nameInitials } from '@shared/lib/strings/initials';
import { useAdminCustomerDataQuery } from '@shared/redux/hooks/useCustomerQuery';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import { CustomerDetail } from './CustomerDetail';

enum RowOption {
    CreditCustomer,
    ResendAccessEmail,
}

const Root = styled(Grid)({
    background: '#F9F9F9',
    padding: '20px',

    '.ImageDiv': {
        maxWidth: '10%!important',
    },
    '.Avatar': {
        background: '#B5CBED',
        borderRadius: '4px',
        width: '100%',
        height: '100%',
        fontWeight: 500,
        fontSize: '50px',
        lineHeight: '59px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CustomerName': {
        fontWeight: 500,
        fontSize: '24px',
        lineHeight: '28px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CustomerDataHeading': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '2px 0px',
    },
    '.CustomerData': {
        paddingTop: '10px',
    },
    '.CustomerDataValue': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        paddingLeft: '5px',
    },
    '.Actions': {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingTop: '10px',
    },
});

export function CustomerView() {
    const { id } = useParams<'id'>();
    const [creditDialog, setCreditDialog] = useState(false);

    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);

    const { data, isLoading } = useAdminCustomerDataQuery({
        resourceId: Number(id),
    });

    const handleOption = useCallback((action: RowOption, value?: any) => {
        switch (action) {
            case RowOption.CreditCustomer:
                setCreditDialog(true);
                break;

            case RowOption.ResendAccessEmail:
                break;
        }
    }, []);

    if (isLoading || !data) {
        return (
            <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Root container>
                <Grid container item xs className={'ImageDiv'} alignItems={'center'}>
                    <Avatar src={data.profileImage ?? ''} variant="square" className={'Avatar'}>
                        {nameInitials(data.fullName)}
                    </Avatar>
                </Grid>
                <Grid container item xs alignItems={'center'} pl={2}>
                    <Grid className={'CustomerData'}>
                        <Typography className={'CustomerName'}>{data.fullName}</Typography>
                        <Typography className={'CustomerDataHeading'}>
                            Customer ID: <span className={'CustomerDataValue'}>{data.customerNumber}</span>
                        </Typography>
                        <Typography className={'CustomerDataHeading'}>
                            Email: <span className={'CustomerDataValue'}>{data.email}</span>
                        </Typography>
                        <Typography className={'CustomerDataHeading'}>
                            Phone: <span className={'CustomerDataValue'}>{data.phone ?? '-'}</span>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item xs className={'Actions'}>
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        sx={{ borderRadius: '24px', padding: '10px 20px' }}
                        disabled
                    >
                        CREATE SUBMISSION
                    </Button>
                    <OptionsMenu onClick={handleOption}>
                        <OptionsMenuItem action={RowOption.CreditCustomer}>Credit Customer</OptionsMenuItem>
                        <OptionsMenuItem action={RowOption.ResendAccessEmail}>Resend Access Email</OptionsMenuItem>
                    </OptionsMenu>
                </Grid>
                <CustomerCreditDialog
                    customerName={data.fullName}
                    wallet={data?.wallet}
                    open={creditDialog}
                    onClose={handleCreditDialogClose}
                />
            </Root>
            <CustomerDetail customerData={data} />
        </>
    );
}

export default CustomerView;
