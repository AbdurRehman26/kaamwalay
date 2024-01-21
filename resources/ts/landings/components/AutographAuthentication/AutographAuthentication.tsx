import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { useMemo } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import AutographAuthenticationSearch from './AutographAuthenticationSearch';

export function AutographAuthentication() {
    const { appEnv, meilisearchPublicHost, meilisearchPublicKey } = useConfiguration();
    const searchClient = useMemo(
        () => instantMeiliSearch(meilisearchPublicHost!, meilisearchPublicKey!),
        [meilisearchPublicHost, meilisearchPublicKey],
    );
    return (
        <InstantSearch indexName={`${appEnv}_autograph_products`} searchClient={searchClient}>
            <AutographAuthenticationSearch />
        </InstantSearch>
    );
}

export default AutographAuthentication;
