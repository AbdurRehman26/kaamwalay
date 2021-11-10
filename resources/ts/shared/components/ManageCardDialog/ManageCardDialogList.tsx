import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import algoliaSearch from 'algoliasearch';
import React, { ForwardedRef, forwardRef, useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { useConfiguration } from '../../hooks/useConfiguration';
import ManageCardDialogHeader from './ManageCardDialogHeader';
import ManageCardDialogResults from './ManageCardDialogResults';
import ManageCardDialogSearch from './ManageCardDialogSearch';
import ManagerCardDialogSelectedCardPreview from '@shared/components/ManageCardDialog/ManagerCardDialogSelectedCardPreview';
import { useAppSelector } from '@admin/redux/hooks';

interface ListCardsViewProps {}

const useStyles = makeStyles(
    () => ({
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
    const selectedCard = useAppSelector((state) => state.manageCardDialog.selectedCard);

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
                    {selectedCard ? <ManagerCardDialogSelectedCardPreview /> : null}
                    <ManageCardDialogSearch />
                    <ManageCardDialogResults />
                </InstantSearch>
            </Box>
        </div>
    );
});

export default ManageCardDialogList;
