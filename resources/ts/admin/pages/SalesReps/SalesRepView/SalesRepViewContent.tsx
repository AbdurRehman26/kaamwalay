import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import SalesRepViewContentHeader from '@admin/pages/SalesReps/SalesRepView/SalesRepViewContentHeader';
import SalesRepViewCustomersTab from '@admin/pages/SalesReps/SalesRepView/SalesRepViewCustomersTab';
import { SalesRepViewOverviewTab } from '@admin/pages/SalesReps/SalesRepView/SalesRepViewOverviewTab';
import SalesRepViewSubmissionsTab from '@admin/pages/SalesReps/SalesRepView/SalesRepViewSubmissionsTab';

interface SalesRepViewContentProps {
    salesrep: SalesRepEntity;
}

const TabContent = styled(TabPanel)(
    {
        padding: 0,
    },
    { name: 'TabContent' },
);

export function SalesRepViewContent({ salesrep }: SalesRepViewContentProps) {
    const { tab } = useParams<{ tab: string }>();
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
                    <SalesRepViewSubmissionsTab />
                </TabContent>
                <TabContent value={'customers'}>
                    <SalesRepViewCustomersTab />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default SalesRepViewContent;
