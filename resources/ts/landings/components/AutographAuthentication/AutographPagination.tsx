import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { connectPagination } from 'react-instantsearch-dom';
import { useSelector } from 'react-redux';
import theme from '@shared/styles/theme';
import { RootState } from '../../redux/store';

const PaginationGrid = styled(Grid)({
    [theme.breakpoints.up('sm')]: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
    },
});

const CustomPagination = connectPagination(({ currentRefinement, refine }) => {
    const totalItemsLength = useSelector((state: RootState) => state.feed.filterResults.results);
    const itemsPerPage = useSelector((state: RootState) => state.feed.totalItemsPerPage.itemsPerPage);

    const handleChange = (event: any, value: any) => {
        refine(value);
    };

    const paginationCount = totalItemsLength < itemsPerPage ? 1 : Math.ceil(totalItemsLength / itemsPerPage);

    return (
        <PaginationGrid>
            <Pagination count={paginationCount} color="primary" page={currentRefinement} onChange={handleChange} />
        </PaginationGrid>
    );
});

export function AutographPagination() {
    return <CustomPagination />;
}

export default AutographPagination;
