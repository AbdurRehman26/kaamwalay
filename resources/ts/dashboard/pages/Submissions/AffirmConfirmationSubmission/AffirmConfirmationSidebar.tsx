import CheckIcon from '@mui/icons-material/Check';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { font } from '@shared/styles/utils';
import { useConfirmationSubmissionSidebarStyles } from '../CollectorCoinConfirmationSubmission/style';

export function AffirmConfirmationSidebar() {
    const classes = useConfirmationSubmissionSidebarStyles();

    return (
        <Paper variant={'outlined'} className={classes.root}>
            <Box paddingY={3} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Avatar className={classes.successIconHolder}>
                    <CheckIcon className={classes.successIcon} />
                </Avatar>
                <Typography align={'center'} variant={'h6'} className={font.fontWeightBold} gutterBottom>
                    Submission Payment Submitted!
                </Typography>
                <Typography align={'center'} variant={'body2'}>
                    We're currently processing your payment. This can take a few minutes, please wait for further
                    instructions.
                </Typography>
            </Box>
            <Divider />
            <Box paddingY={3} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
            <Divider />
        </Paper>
    );
}
