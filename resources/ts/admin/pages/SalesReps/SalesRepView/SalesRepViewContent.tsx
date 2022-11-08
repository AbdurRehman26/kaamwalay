import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import SalesRepViewContentHeader from '@admin/pages/SalesReps/SalesRepView/SalesRepViewContentHeader';
import { SalesRepViewOverviewTab } from '@admin/pages/SalesReps/SalesRepView/SalesRepViewOverviewTab';

const TabContent = styled(TabPanel)(
    {
        padding: 0,
    },
    { name: 'TabContent' },
);

export function SalesRepViewContent({ salesrep }) {
    const { tab } = useParams<{ tab: string }>();
    // const isTableLoading = useSharedSelector((state) => state.adminNewPromoCodeSlice.isTableLoading);

    const isLoading = false;
    if (isLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <TabContext value={tab || 'all'}>
            <Grid container direction={'column'}>
                <SalesRepViewContentHeader />
                <Divider />
                <TabContent value={'overview'}>
                    <SalesRepViewOverviewTab salesrep={salesrep} />
                </TabContent>
                <TabContent value={'submissions'}>
                    Submissions
                    {/* <PromoCodesTable search={search} tabFilter={PromoCodeStatusEnum.active} />*/}
                </TabContent>
                <TabContent value={'customers'}>
                    Customers
                    {/* <PromoCodesTable search={search} tabFilter={PromoCodeStatusEnum.inactive} />*/}
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default SalesRepViewContent;
