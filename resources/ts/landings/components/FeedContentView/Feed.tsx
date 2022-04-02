import algoliaSearch from 'algoliasearch/lite';
import { useMemo } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import FeedSearch from './FeedSearch';

export function Feed() {
    const { appEnv, algoliaAppId, algoliaPublicKey } = useConfiguration();
    const searchClient = useMemo(
        () => algoliaSearch(algoliaAppId!, algoliaPublicKey!),
        [algoliaAppId, algoliaPublicKey],
    );
    return (
        <InstantSearch indexName={`${appEnv}_user_cards`} searchClient={searchClient}>
            <FeedSearch />
        </InstantSearch>
    );
}

export default Feed;
