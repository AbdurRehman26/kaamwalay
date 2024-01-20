import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { connectPagination } from 'react-instantsearch-dom';
import theme from '@shared/styles/theme';

const PaginationGrid = styled(Grid)({
    [theme.breakpoints.up('sm')]: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
    },
});

const CustomPagination = connectPagination(({ currentRefinement, nbPages, refine }) => {
    const handleChange = (event: any, value: any) => {
        refine(value);
    };

    return (
        <PaginationGrid>
            <Pagination count={nbPages} color="primary" page={currentRefinement} onChange={handleChange} />
        </PaginationGrid>
    );
});

export function AutographPagination() {
    return <CustomPagination />;
}

export default AutographPagination;
