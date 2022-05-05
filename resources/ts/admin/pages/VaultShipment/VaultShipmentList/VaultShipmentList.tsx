import TabContext from '@mui/lab/TabContext';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListPageHeader, ListPageTabContent, ListPageTabs } from '../../../components/ListPage';
import { VaultShipmentCardsInVault } from './VaultShipmentCardsInVault';
import { VaultShipments } from './VaultShipments';

export function VaultShipmentList() {
    const { tab } = useParams<{ tab: string }>();

    return (
        <TabContext value={tab ?? 'shipments'}>
            <Grid container direction={'column'}>
                <ListPageHeader title={'Vault Storage'} pb={0}>
                    <ListPageTabs>
                        <Tab
                            component={Link}
                            to={'/vault-storage/shipments/list'}
                            value={'shipments'}
                            label="Shipments"
                        />
                        <Tab
                            component={Link}
                            to={'/vault-storage/cards-in-vault/list'}
                            value={'cards-in-vault'}
                            label="Cards in Vault"
                        />
                    </ListPageTabs>
                </ListPageHeader>
                <ListPageTabContent value={'shipments'}>
                    <VaultShipments />
                </ListPageTabContent>
                <ListPageTabContent value={'cards-in-vault'}>
                    <VaultShipmentCardsInVault />
                </ListPageTabContent>
            </Grid>
        </TabContext>
    );
}
