import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { CustomerSubmissionListView } from './CustomerSubmissionListView';

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

export function CustomerDetail() {
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
                            <Typography className={'CustomerDataValue'}>10/20/2022</Typography>
                            <Typography className={'CustomerDataValue'}>User</Typography>
                            <Typography className={'CustomerDataValue'}>-</Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <div>
                        <Typography className={'Submissions'}>Submissions</Typography>
                        <Typography className={'TotalSubmissions'}>3</Typography>
                    </div>
                </Grid>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <Grid container>
                        <Grid container item xs>
                            <Typography className={'Wallet'}>Wallet </Typography>
                            <Typography className={'WalletTotalAmount'}>$50.00</Typography>
                        </Grid>
                        <Grid container item xs justifyContent={'flex-end'}>
                            <AddIcon />
                        </Grid>
                    </Grid>
                </Grid>
            </Root>
            <CustomerSubmissionListView />
        </>
    );
}

export default CustomerDetail;
