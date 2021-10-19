import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Hits, Stats } from 'react-instantsearch-dom';
import ManageCardDialogResultItem from './ManageCardDialogResultItem';
import ManageCardDialogResultsPagination from './ManageCardDialogResultsPagination';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(3),
            '& .ais-Hits-item': {
                listStyleType: 'none',
            },
            '& .ais-Hits-list': {
                padding: 0,
                margin: 0,
            },
            '& .ais-Hits': {
                border: '1px solid #e0e0e0',
                maxHeight: 420,
                overflowY: 'auto',
                marginBottom: theme.spacing(3),
            },
            '& .ais-Stats-text': {
                fontSize: 12,
                fontWeight: 500,
                fontFamily: theme.typography.fontFamily,
                marginBottom: theme.spacing(1),
            },
        },
    }),
    { name: 'ManageCardDialogResults' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialogResults
 * @date: 13.09.2021
 * @time: 23:44
 */
export function ManageCardDialogResults() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Stats translations={{ stats: (nbHits) => `${nbHits} Results` }} />
            <Hits hitComponent={ManageCardDialogResultItem} />
            <ManageCardDialogResultsPagination />
        </div>
    );
}

export default ManageCardDialogResults;
