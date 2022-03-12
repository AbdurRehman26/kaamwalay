import Container from '@mui/material/Container';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import FeedCategories from './FeedCategories';
import FeedItemsPerPage from './FeedItemsPerPage';
import FeedPagination from './FeedPagination';
import FeedSearch from './FeedSearch';

export function Feed() {
    const searchClient = algoliasearch('UMRTJP4TLQ', '085cc30e0d991ab2aa990615163f86c5');

    return (
        <InstantSearch indexName="local_user_cards" searchClient={searchClient}>
            <FeedSearch />
            <Container>
                <FeedCategories />
            </Container>
            <Container>
                <FeedItemsPerPage />
                <FeedPagination />
            </Container>
        </InstantSearch>
    );
}

export default Feed;
