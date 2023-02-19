import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export function WithdrawFunds() {
    return (
        <Grid>
            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
                <Typography>Referral Program</Typography>
                <Typography>Withdraw Funds</Typography>
            </Breadcrumbs>
            <Grid>
                <Typography>Withdrawal Amount: $20.00</Typography>
                <Typography>
                    It can take 5-7 days for the withdrawal to finalize. It will show up as “pending” until it’s
                    completed.
                </Typography>
            </Grid>
            <Grid>
                <Typography>Payout Account (PayPal)</Typography>
                <Typography>Please enter the PayPal email where you would like to be paid out.</Typography>
                <TextField
                    placeholder="Enter Paypal Email"
                    fullWidth
                    value={''}
                    onChange={(e: any) => console.log('1')}
                    variant={'outlined'}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Typography>Don’t have one? Create a PayPal Account</Typography>
            </Grid>
            <Divider />
            <Grid>
                <Typography>
                    Once you start a withdrawal, it can’t be undone. The withdrawal amount will be deducted from your
                    Withdrawable Commission, and you will be able to see the pending transaction in your Withdrawals
                    section. It can take 5-7 days for the funds to transfer to your payout account.
                </Typography>
                <Button>START WITHDRAWAL</Button>
            </Grid>
        </Grid>
    );
}

export default WithdrawFunds;
