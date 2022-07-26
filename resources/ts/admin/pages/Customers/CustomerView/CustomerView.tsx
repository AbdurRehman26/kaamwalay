import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import { OptionsMenu, OptionsMenuItem } from '@shared/components/OptionsMenu';
import { nameInitials } from '@shared/lib/strings/initials';
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
    const handleOption = useCallback((action: RowOption, value?: any) => {
        switch (action) {
            case RowOption.CreditCustomer:
                break;

            case RowOption.ResendAccessEmail:
                break;
        }
    }, []);

    return (
        <>
            <Root container>
                <Grid container item xs className={'ImageDiv'} alignItems={'center'}>
                    <Avatar src={''} variant="square" className={'Avatar'}>
                        {nameInitials('Jim Jones')}
                    </Avatar>
                </Grid>
                <Grid container item xs alignItems={'center'} pl={2}>
                    <Grid className={'CustomerData'}>
                        <Typography className={'CustomerName'}>Jim Jones</Typography>
                        <Typography className={'CustomerDataHeading'}>
                            Customer ID: <span className={'CustomerDataValue'}>C92029211</span>
                        </Typography>
                        <Typography className={'CustomerDataHeading'}>
                            Email: <span className={'CustomerDataValue'}>jimjones@email.com</span>
                        </Typography>
                        <Typography className={'CustomerDataHeading'}>
                            Phone: <span className={'CustomerDataValue'}>+1 (718) 929-8298</span>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item xs className={'Actions'}>
                    <Button variant={'contained'} color={'primary'} sx={{ borderRadius: '24px' }} disabled>
                        CREATE SUBMISSION
                    </Button>
                    <OptionsMenu onClick={handleOption}>
                        <OptionsMenuItem action={RowOption.CreditCustomer} value={''}>
                            Credit Customer
                        </OptionsMenuItem>
                        <OptionsMenuItem action={RowOption.ResendAccessEmail} value={''}>
                            Resend Access Email
                        </OptionsMenuItem>
                    </OptionsMenu>
                </Grid>
            </Root>
            <CustomerDetail />
        </>
    );
}

export default CustomerView;
