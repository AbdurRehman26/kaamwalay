import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import styled from '@mui/styles/styled';
import * as React from 'react';
import FeedAccordion from './FeedAccordion';

const FeedPopModalBox = styled(Box)({
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
});

const styles = {
    ButtonStyle: {
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
        background: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.18)!important',
        boxSizing: 'border-box',
        borderRadius: '24px',
        padding: '10px 20px',
    },

    ModalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderBottom: '1px solid #E0E0E0',
        padding: '15px 15px',
    },

    ModalHeaderHeading: {
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.5px',
        color: '#000000',
        marginTop: '10px',
    },

    ModalButton: {
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#FFFFFF',
        backgroundColor: '#20BFB8!important',
        border: '1px solid rgba(0, 0, 0, 0.18)!important',
        boxSizing: 'border-box',
        borderRadius: '24px',
        padding: '10px 20px',
        margin: '10px 15px',
        width: '92%',
    },

    ModalButtonDiv: {
        width: '100%',
        background: '#FFFFFF',
        boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.14), 0px 3px 3px rgba(0, 0, 0, 0.12), 0px 1px 8px rgba(0, 0, 0, 0.2)',
        position: 'fixed',
        bottom: '0',
    },
};

export function FeedMobileView() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <Button sx={styles.ButtonStyle} onClick={handleOpen} startIcon={<FilterAltOutlinedIcon />}>
                Sort & Filter
            </Button>
            <Modal open={open}>
                <FeedPopModalBox>
                    <Grid sx={styles.ModalHeader}>
                        <Typography sx={styles.ModalHeaderHeading}>Sort & Filter</Typography>
                        <IconButton sx={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={handleClose}>
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Grid>
                    <Grid>
                        <FeedAccordion />
                    </Grid>
                    <Grid sx={styles.ModalButtonDiv}>
                        <Button sx={styles.ModalButton} onClick={handleClose}>
                            SEE ALL RESULTS
                        </Button>
                    </Grid>
                </FeedPopModalBox>
            </Modal>
        </Box>
    );
}

export default FeedMobileView;
