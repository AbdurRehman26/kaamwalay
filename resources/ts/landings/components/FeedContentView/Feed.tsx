import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { useMemo } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import FeedSearch from './FeedSearch';

export function Feed() {
    const { appEnv, meilisearchPublicHost, meilisearchPublicKey } = useConfiguration();
    const searchClient = useMemo(
        () => instantMeiliSearch(meilisearchPublicHost!, meilisearchPublicKey!),
        [meilisearchPublicHost, meilisearchPublicKey],
    );
    return (
        <InstantSearch indexName={`${appEnv}_user_cards`} searchClient={searchClient}>
            <FeedSearch />
        </InstantSearch>
    );
}

export default Feed;
