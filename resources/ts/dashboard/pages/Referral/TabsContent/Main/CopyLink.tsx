import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const styles = {
    MainText: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        marginBottom: '20px',
    },
    ShareLinkText: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '10px 0px',
    },
    InputBox: {
        background: '#FFFFFF',
        border: '1px solid #DEDEDE',
        borderRadius: '4px 0px 0px 4px',
        padding: '10px 15px',
        width: '100%',
    },
    SmallText: {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '10px 0px',
    },
    CopyButton: {
        background: '#F5F5F5',
        borderRadius: '0px 3px 3px 0px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#20BFB8',
        padding: '17px',
        '&:hover': {
            background: '#F5F5F5',
            color: '#20BFB8',
        },
    },
    ImagesDivHeading: {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        margin: '50px 0px',
    },
    InputDiv: {
        display: 'flex',
        alignItems: 'center',
    },
    SnackBarDiv: {
        background: '#20BFB8',
        borderRadius: '28px',
        padding: '15px 25px',
    },
    SnackBarTitle: {
        fontWeight: '500px',
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: '#FFFFFF',
        marginLeft: '5px',
    },
    SnackBarIcon: {
        color: '#fff',
        fontSize: '25px',
    },
    SnackBarContentDiv: {
        display: 'flex',
    },
};

interface props {
    referralUrl: string;
}

export function Copylink({ referralUrl }: props) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    return (
        <div>
            <Typography sx={styles.ShareLinkText}>Your unique link:</Typography>
            <Grid sx={styles.InputDiv}>
                <Grid width={'100%'}>
                    <Input type="text" value={referralUrl} disableUnderline sx={styles.InputBox} />
                </Grid>
                <Grid>
                    <CopyToClipboard text={referralUrl} onCopy={() => handleClick()}>
                        <Button sx={styles.CopyButton}>copy</Button>
                    </CopyToClipboard>
                    <Snackbar
                        open={open}
                        onClose={handleClose}
                        autoHideDuration={1000}
                        sx={styles.SnackBarDiv}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                        <Grid sx={styles.SnackBarContentDiv}>
                            <CheckCircleRoundedIcon sx={styles.SnackBarIcon} />
                            <Typography sx={styles.SnackBarTitle}>Link Copied!</Typography>
                        </Grid>
                    </Snackbar>
                </Grid>
            </Grid>
            <Typography sx={styles.SmallText}>
                Copy and paste this link to send it through any channel you prefer.
            </Typography>
        </div>
    );
}

export default Copylink;
