import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PromoCodesListHeader from '@admin/pages/PromoCodes/PromoCodesList/PromoCodesListHeader';
import { PromoCodesTable } from '@admin/pages/PromoCodes/PromoCodesList/PromoCodesTable';
import { PromoCodeStatusEnum } from '@shared/constants/PromoCodeStatusEnum';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const TabContent = styled(TabPanel)(
    {
        padding: 0,
    },
    { name: 'TabContent' },
);

export function PromoCodesList() {
    const { tab } = useParams<{ tab: string }>();
    const [search, setSearch] = useState('');
    const isTableLoading = useSharedSelector((state) => state.adminNewPromoCodeSlice.isTableLoading);

    if (isTableLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <TabContext value={tab || 'all'}>
            <Grid container direction={'column'}>
                <PromoCodesListHeader onSearch={setSearch} />

                <Divider />
                <TabContent value={'all'}>
                    <PromoCodesTable search={search} all />
                </TabContent>
                <TabContent value={'active'}>
                    <PromoCodesTable search={search} tabFilter={PromoCodeStatusEnum.active} />
                </TabContent>
                <TabContent value={'inactive'}>
                    <PromoCodesTable search={search} tabFilter={PromoCodeStatusEnum.inactive} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default PromoCodesList;
