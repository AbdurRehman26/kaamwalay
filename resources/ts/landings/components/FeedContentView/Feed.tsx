import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import theme from '@shared/styles/theme';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import FeedItemsPerPage from './FeedItemsPerPage';
import FeedPagination from './FeedPagination';
import FeedSearch from './FeedSearch';

const PaginationBox = styled(Box)({
    display: 'flex',
    float: 'right',
    padding: '20px 20px',
    [theme.breakpoints.down('sm')]: {
        float: 'none',
    },
});

export function Feed() {
    const searchClient = algoliasearch('UMRTJP4TLQ', '085cc30e0d991ab2aa990615163f86c5');

    return (
        <InstantSearch indexName="local_user_cards" searchClient={searchClient}>
            <FeedSearch />
            <PaginationBox>
                <FeedItemsPerPage />
                <FeedPagination />
            </PaginationBox>
        </InstantSearch>
    );
}

export default Feed;
