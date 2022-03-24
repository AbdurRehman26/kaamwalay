import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import algoliaSearch from 'algoliasearch/lite';
import { useMemo } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import theme from '@shared/styles/theme';
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
    const { appEnv, algoliaAppId, algoliaPublicKey } = useConfiguration();
    const searchClient = useMemo(
        () => algoliaSearch(algoliaAppId!, algoliaPublicKey!),
        [algoliaAppId, algoliaPublicKey],
    );
    return (
        <InstantSearch indexName={`${appEnv}_user_cards`} searchClient={searchClient}>
            <FeedSearch />
            <PaginationBox>
                <FeedItemsPerPage />
                <FeedPagination />
            </PaginationBox>
        </InstantSearch>
    );
}

export default Feed;
