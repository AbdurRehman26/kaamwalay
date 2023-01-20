import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
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
        borderRadius: '4px',
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
        borderLeft: '1px solid #E0E0E0',
        borderRadius: '0px 3px 3px 0px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#20BFB8',
    },
    ImagesDivHeading: {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        margin: '50px 0px',
    },
};

export function Copylink() {
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
            <Input
                type="text"
                value={'www.robograding.com/referral/C902039'}
                disableUnderline
                sx={styles.InputBox}
                endAdornment={
                    <InputAdornment position="end">
                        <CopyToClipboard text={'www.robograding.com/referral/C902039'} onCopy={() => handleClick()}>
                            <Typography sx={styles.CopyButton}>copy</Typography>
                        </CopyToClipboard>
                    </InputAdornment>
                }
            />
            <Typography sx={styles.SmallText}>
                Copy and paste this link to send it through any channel you prefer.
            </Typography>
            <Snackbar
                open={open}
                onClose={handleClose}
                autoHideDuration={1000}
                sx={{
                    background: '#20BFB8',
                    borderRadius: '28px',
                    padding: '15px 25px',
                }}
            >
                <Typography
                    sx={{
                        fontWeight: '500px',
                        fontSize: '20px',
                        lineHeight: '24px',
                        letterSpacing: '0.15px',
                        color: '#FFFFFF',
                    }}
                >
                    <CheckCircleRoundedIcon sx={{ color: '#fff', fontSize: '25px' }} /> Link Copied!
                </Typography>
            </Snackbar>
        </div>
    );
}

export default Copylink;
