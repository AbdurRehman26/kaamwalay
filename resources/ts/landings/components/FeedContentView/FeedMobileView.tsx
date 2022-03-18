import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styled from '@mui/styles/styled';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Grid from '@mui/material/Grid';
import FeedAccordion from './FeedAccordion';

const FeedPopModalBox = styled(Box)({
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',

    '.ModalHeader': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
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
            <Modal open={open} onClose={handleClose}>
                <FeedPopModalBox>
                    <Grid className={'ModalHeader'}>
                        <Typography>Sort & Filter</Typography>
                        <IconButton sx={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={handleClose}>
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Grid>
                    <Grid>
                        <FeedAccordion />
                    </Grid>
                </FeedPopModalBox>
            </Modal>
        </Box>
    );
}

export default FeedMobileView;
