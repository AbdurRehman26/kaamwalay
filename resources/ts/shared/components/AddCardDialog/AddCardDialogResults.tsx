import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Hits, Stats } from 'react-instantsearch-dom';
import AddCardDialogResultItem from './AddCardDialogResultItem';
import AddCardDialogResultsPagination from './AddCardDialogResultsPagination';

interface AddCardDialogResultsProps {}

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
    { name: 'AddCardDialogResults' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AddCardDialogResults
 * @date: 13.09.2021
 * @time: 23:44
 */
export function AddCardDialogResults(props: AddCardDialogResultsProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Stats translations={{ stats: (nbHits) => `${nbHits} Results` }} />
            <Hits hitComponent={AddCardDialogResultItem} />
            <AddCardDialogResultsPagination />
        </div>
    );
}

export default AddCardDialogResults;
