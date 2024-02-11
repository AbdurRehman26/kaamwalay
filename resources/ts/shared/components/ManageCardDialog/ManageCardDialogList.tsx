import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import React, { ForwardedRef, forwardRef } from 'react';
import ManageCardDialogHeader from './ManageCardDialogHeader';

interface ListCardsViewProps {}

const useStyles = makeStyles(
    () => ({
        root: {},
    }),
    { name: 'ListCardsView' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ListCardsView
 * @date: 13.09.2021
 * @time: 19:31
 */
export const ManageCardDialogList = forwardRef((props: ListCardsViewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const classes = useStyles();

    return (
        <div className={classes.root} ref={ref}>
            <ManageCardDialogHeader />
            <Box p={3}></Box>
        </div>
    );
});

export default ManageCardDialogList;
