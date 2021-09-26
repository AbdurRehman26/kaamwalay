import Pagination from '@mui/material/Pagination';
import makeStyles from '@mui/styles/makeStyles';
import { connectPagination } from 'react-instantsearch-dom';

const useStyles = makeStyles({
    pagination: {
        display: 'flex',
        marginBottom: '24px',
        justifyContent: 'center',
    },
});

function HitsPagination({ nbPages, currentRefinement, refine }: Record<string, any>) {
    const classes = useStyles();
    const handleChange = (event: any, value: any) => {
        refine(value);
    };

    return (
        <div className={classes.pagination}>
            <Pagination
                count={nbPages}
                page={currentRefinement}
                onChange={handleChange}
                color="primary"
                hideNextButton={nbPages <= 0}
                hidePrevButton={nbPages <= 0}
            />
        </div>
    );
}

const CustomPagination = connectPagination(HitsPagination);

export default CustomPagination;
