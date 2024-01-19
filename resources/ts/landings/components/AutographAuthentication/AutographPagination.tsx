import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { connectPagination } from 'react-instantsearch-dom';

const CustomPagination = connectPagination(({ currentRefinement, nbPages, refine }) => {
    const handleChange = (event: any, value: any) => {
        refine(value);
    };

    return (
        <Grid display={'flex'}>
            <Pagination count={nbPages} color="primary" page={currentRefinement} onChange={handleChange} />
        </Grid>
    );
});

export function AutographPagination() {
    return <CustomPagination />;
}

export default AutographPagination;
