import { makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import { useCallback } from 'react';
import { connectPagination } from 'react-instantsearch-dom';

const useStyles = makeStyles(
    () => ({
        list: {
            justifyContent: 'center',
        },
    }),
    { name: 'ManageCardDialogResultsPagination' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialogResultsPagination
 * @date: 13.09.2021
 * @time: 23:56
 */
export const ManageCardDialogResultsPagination = connectPagination(({ nbPages, currentRefinement, refine }) => {
    const classes = useStyles();

    const handleChange = useCallback((event: any, value: any) => refine(value), [refine]);

    return (
        <Pagination
            count={nbPages}
            page={currentRefinement}
            onChange={handleChange}
            color={'primary'}
            hideNextButton={nbPages <= 0}
            hidePrevButton={nbPages <= 0}
            classes={{ ul: classes.list }}
        />
    );
});

export default ManageCardDialogResultsPagination;
