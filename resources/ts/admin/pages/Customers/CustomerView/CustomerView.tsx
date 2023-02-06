import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { OptionsMenu, OptionsMenuItem } from '@shared/components/OptionsMenu';
import { nameInitials } from '@shared/lib/strings/initials';
import { useAdminCustomerQuery } from '@shared/redux/hooks/useCustomerQuery';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import { resendAccessEmail } from '@admin/redux/slices/submissionGradeSlice';
import { CustomerDetail } from './CustomerDetail';
import { CustomerViewContent } from './CustomerViewContent';

enum RowOption {
    CreditCustomer,
    ResendAccessEmail,
}

const Root = styled(Grid)({
    background: '#F9F9F9',
    padding: '20px',

    '.ImageDiv': {
        maxWidth: '120px!important',
        maxHeight: '120px!important',
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
    '.CustomerHeading': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '2px 0px',
    },
    '.Customer': {
        paddingTop: '10px',
    },
    '.CustomerValue': {
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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCreditDialogClose = useCallback(() => {
        setCreditDialog(false);
    }, []);

    const createCustomerSubmission = () => {
        navigate(`/submissions/${id}/new`, { state: { from: 'customer' } });
    };

    const customer$ = useAdminCustomerQuery({
        resourceId: Number(id),
    });

    // const customerReferral$ = useAdminCustomerQuery({
    //     resourceId: Number(id),
    // });

    const handleReloadCustomerData = useCallback(() => {
        customer$.request();
    }, [customer$]);

    const { data, isLoading } = customer$;

    const handleOption = useCallback(
        (action: RowOption) => {
            switch (action) {
                case RowOption.CreditCustomer:
                    setCreditDialog(true);
                    break;

                case RowOption.ResendAccessEmail:
                    dispatch(resendAccessEmail(id));
                    break;
            }
        },
        [dispatch, id],
    );

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
                    <Grid className={'Customer'}>
                        <Typography className={'CustomerName'}>{data.fullName}</Typography>
                        <Typography className={'CustomerHeading'}>
                            Customer ID: <span className={'CustomerValue'}>{data.customerNumber}</span>
                        </Typography>
                        <Typography className={'CustomerHeading'}>
                            Email: <span className={'CustomerValue'}>{data.email}</span>
                        </Typography>
                        <Typography className={'CustomerHeading'}>
                            Phone: <span className={'CustomerValue'}>{data.phone ?? '-'}</span>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item xs className={'Actions'}>
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        sx={{ borderRadius: '24px', padding: '10px 20px' }}
                        onClick={createCustomerSubmission}
                    >
                        CREATE SUBMISSION
                    </Button>
                    <OptionsMenu onClick={handleOption}>
                        <OptionsMenuItem action={RowOption.CreditCustomer}>Credit Customer</OptionsMenuItem>
                        {data.createdBy && !data.lastLoginAt ? (
                            <OptionsMenuItem action={RowOption.ResendAccessEmail}>Resend Access Email</OptionsMenuItem>
                        ) : null}
                    </OptionsMenu>
                </Grid>
                <CustomerCreditDialog
                    customer={data}
                    wallet={data?.wallet}
                    open={creditDialog}
                    onClose={handleCreditDialogClose}
                    onSubmit={handleReloadCustomerData}
                />
            </Root>
            <Grid container>
                {' '}
                <CustomerViewContent customer={data} />{' '}
            </Grid>
            <CustomerDetail handleResendCall={handleReloadCustomerData} customer={data} />
        </>
    );
}

export default CustomerView;
