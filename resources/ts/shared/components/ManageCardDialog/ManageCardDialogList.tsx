import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import React, { ForwardedRef, forwardRef, useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import ManagerCardDialogSelectedCardPreview from '@shared/components/ManageCardDialog/ManagerCardDialogSelectedCardPreview';
import { useAppSelector } from '@admin/redux/hooks';
import { useConfiguration } from '../../hooks/useConfiguration';
import ManageCardDialogHeader from './ManageCardDialogHeader';
import ManageCardDialogResults from './ManageCardDialogResults';
import ManageCardDialogSearch from './ManageCardDialogSearch';

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
    const { appEnv, meilisearchPublicHost, meilisearchPublicKey, searchCardCategoriesAdmin } = useConfiguration();
    const selectedCard = useAppSelector((state) => state.manageCardDialog.selectedCard);

    const searchClient = useMemo(
        () =>
            instantMeiliSearch(meilisearchPublicHost, meilisearchPublicKey, {
                finitePagination: true,
            }),
        [meilisearchPublicHost, meilisearchPublicKey],
    );

    return (
        <div className={classes.root} ref={ref}>
            <ManageCardDialogHeader />
            <Box p={3}>
                <InstantSearch searchClient={searchClient} indexName={`${appEnv}_card_products`}>
                    {searchCardCategoriesAdmin ? (
                        <Configure
                            hitsPerPage={32}
                            filters={`card_category_name:${searchCardCategoriesAdmin.replace(
                                /,/g,
                                ' OR card_category_name:',
                            )}`}
                        />
                    ) : (
                        <Configure hitsPerPage={32} />
                    )}
                    {selectedCard ? <ManagerCardDialogSelectedCardPreview /> : null}
                    <ManageCardDialogSearch />
                    <ManageCardDialogResults />
                </InstantSearch>
            </Box>
        </div>
    );
});

export default ManageCardDialogList;
