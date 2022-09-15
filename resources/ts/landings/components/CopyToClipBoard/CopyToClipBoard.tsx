import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {
    content: string;
    buttonContent?: string;
}

export default function CopyClipboard({ content, buttonContent }: Props) {
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
        <>
            <CopyToClipboard text={content} onCopy={() => handleClick()}>
                {buttonContent === 'mobile' ? (
                    <IosShareOutlinedIcon />
                ) : (
                    <Avatar
                        sx={{
                            color: 'rgba(0, 0, 0, 0.38)',
                            border: '2px solid rgba(0, 0, 0, 0.24)',
                            background: '#F4F4FB',
                            width: '28px',
                            height: '28px',
                        }}
                    >
                        <ContentCopyOutlinedIcon sx={{ width: '15px' }} />
                    </Avatar>
                )}
            </CopyToClipboard>
            <Snackbar
                open={open}
                onClose={handleClose}
                autoHideDuration={1000}
                sx={{
                    background: '#20BFB8',
                    borderRadius: '28px',
                    padding: '15px 25px',
                    left: buttonContent === 'mobile' ? '100px!important' : 'auto!important',
                    right: 'auto!important',
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
        </>
    );
}