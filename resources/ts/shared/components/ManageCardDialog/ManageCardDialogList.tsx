import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import algoliaSearch from 'algoliasearch';
import React, { ForwardedRef, forwardRef, useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { useConfiguration } from '../../hooks/useConfiguration';
import ManageCardDialogHeader from './ManageCardDialogHeader';
import ManageCardDialogResults from './ManageCardDialogResults';
import ManageCardDialogSearch from './ManageCardDialogSearch';

interface ListCardsViewProps {}

const useStyles = makeStyles(
    (theme) => ({
        root: {},
    }),
    { name: 'ListCardsView' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ListCardsView
 * @date: 13.09.2021
 * @time: 19:31
 */
export const ManageCardDialogList = forwardRef((props: ListCardsViewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const classes = useStyles();
    const { appEnv, algoliaAppId, algoliaPublicKey } = useConfiguration();

    const searchClient = useMemo(
        () => algoliaSearch(algoliaAppId!, algoliaPublicKey!),
        [algoliaAppId, algoliaPublicKey],
    );

    return (
        <div className={classes.root} ref={ref}>
            <ManageCardDialogHeader />
            <Box p={3}>
                <InstantSearch searchClient={searchClient} indexName={`${appEnv}_card_products`}>
                    <Configure hitsPerPage={32} />
                    <ManageCardDialogSearch />
                    <ManageCardDialogResults />
                </InstantSearch>
            </Box>
        </div>
    );
});

export default ManageCardDialogList;