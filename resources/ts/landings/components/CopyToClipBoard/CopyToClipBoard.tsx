import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import FacebookIcon from '@shared/assets/facebookIconDesktop.svg';
import InstagramIcon from '@shared/assets/instagramIconDesktop.svg';
import TwitterIcon from '@shared/assets/twitterIconDesktop.svg';

interface Props {
    content: string;
    socialImage?: string;
}

export default function CopyClipboard({ content, socialImage }: Props) {
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
            <Grid sx={{ display: 'flex' }}>
                <TwitterShareButton
                    url={content}
                    hashtags={['gemsonly']}
                    title={'@agsgrading'}
                    style={{ marginRight: '10px' }}
                >
                    <img src={TwitterIcon} alt={'Twitter'} />
                </TwitterShareButton>
                <FacebookShareButton url={content} style={{ marginRight: '10px' }}>
                    <img src={FacebookIcon} alt={'Facebook'} />
                </FacebookShareButton>
                {socialImage ? (
                    <a href={socialImage} download>
                        <Button style={{ marginRight: '10px', minWidth: '0px', padding: '0px' }}>
                            <img src={InstagramIcon} alt={'Instagram'} />
                        </Button>
                    </a>
                ) : null}
                <CopyToClipboard text={content} onCopy={() => handleClick()}>
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
                </CopyToClipboard>
            </Grid>
            <Snackbar
                open={open}
                onClose={handleClose}
                autoHideDuration={1000}
                sx={{
                    background: '#20BFB8',
                    borderRadius: '28px',
                    padding: '15px 25px',
                    left: 'auto!important',
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
