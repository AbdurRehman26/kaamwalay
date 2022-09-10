import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Facebook from '@mui/icons-material/FacebookOutlined';
import Instagram from '@mui/icons-material/Instagram';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import Twitter from '@mui/icons-material/Twitter';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import styled from '@mui/styles/styled';
import * as React from 'react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CardPageShareModalBox = styled(Box)({
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    overflowY: 'scroll',
});

const styles = {
    ModalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderBottom: '1px solid #E0E0E0',
        padding: '15px 15px',
    },
    ModalHeaderHeading: {
        fontWeight: 400,
        fontSize: '24px',
        lineHeight: '24px',
        letterSpacing: '0.18px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '8px',
    },
    ContentDiv: {
        padding: '20px',
        marginTop: '100px',
    },
    Twitter: {
        background: '#1DA1F2!important',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '28px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#FFFFFF',
        padding: '15px',
        width: '100%',
        marginTop: '30px',
    },
    Facebook: {
        background: '#4267B2!important',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '28px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#FFFFFF',
        padding: '15px',
        width: '100%',
        marginTop: '30px',
    },
    Instagram: {
        background: ' #833AB4!important',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '28px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#FFFFFF',
        padding: '15px',
        width: '100%',
        marginTop: '30px',
    },
    ShareLinkText: {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '10px',
    },
    InputBox: {
        background: '#F0F0F0',
        borderRadius: '28px',
        padding: '10px 15px',
        width: '100%',
    },
};

interface CardPageShareModalProp {
    content: string;
}

export function CardPageShareModal({ content }: CardPageShareModalProp) {
    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = useState(false);

    const handleModal = () => setOpenModal(!openModal);

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
        <Box>
            <IosShareOutlinedIcon onClick={handleModal} />
            <Modal open={openModal}>
                <CardPageShareModalBox>
                    <Grid sx={styles.ModalHeader}>
                        <Typography variant="subtitle1" sx={styles.ModalHeaderHeading}>
                            Share
                        </Typography>
                        <IconButton sx={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={handleModal}>
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Grid>
                    <Grid sx={styles.ContentDiv}>
                        <div>
                            <Typography sx={styles.ShareLinkText}>Share Link</Typography>
                            <Input
                                type="text"
                                value={content}
                                disableUnderline
                                sx={styles.InputBox}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <CopyToClipboard text={content} onCopy={() => handleClick()}>
                                            <ContentCopyOutlinedIcon />
                                        </CopyToClipboard>
                                    </InputAdornment>
                                }
                                disabled
                            />
                        </div>
                        <div>
                            <Button sx={styles.Twitter}>
                                <Twitter sx={{ marginRight: '5px' }} /> SHARE ON TWITTER
                            </Button>
                            <Button sx={styles.Facebook}>
                                <Facebook sx={{ marginRight: '5px' }} /> SHARE ON FACEBOOK
                            </Button>
                            <Button sx={styles.Instagram}>
                                <Instagram sx={{ marginRight: '5px' }} /> SHARE ON INSTAGRAM
                            </Button>
                        </div>
                        <Snackbar
                            open={open}
                            onClose={handleClose}
                            autoHideDuration={1000}
                            sx={{
                                background: '#20BFB8',
                                borderRadius: '28px',
                                padding: '15px 25px',
                                left: '100px!important',
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
                    </Grid>
                </CardPageShareModalBox>
            </Modal>
        </Box>
    );
}

export default CardPageShareModal;
