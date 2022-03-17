import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from '@shared/styles/theme';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import FeedCategories from './FeedCategories';
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
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    return (
        <InstantSearch indexName="local_user_cards" searchClient={searchClient}>
            <FeedSearch />
            {isSm ? (
                <Box>
                    <FeedCategories />
                </Box>
            ) : (
                <Container>
                    <FeedCategories />
                </Container>
            )}
            <PaginationBox>
                <FeedItemsPerPage />
                <FeedPagination />
            </PaginationBox>
        </InstantSearch>
    );
}

export default Feed;
