import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { CustomerViewContentHeader } from './CustomerViewContentHeader';
import { CustomerViewOverViewTab } from './CustomerViewOverViewTab';
import { CustomerViewReferralTab } from './CustomerViewReferralTab';

interface CustomerViewContentProps {
    customer: CustomerEntity;
}

const TabContent = styled(TabPanel)(
    {
        padding: 0,
    },
    { name: 'TabContent' },
);

export function CustomerViewContent({ customer }: CustomerViewContentProps) {
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
                <CustomerViewContentHeader />
                <TabContent value={'overview'}>
                    <CustomerViewOverViewTab customer={customer} />
                </TabContent>
                <Divider />
                <TabContent value={'referrals'}>
                    <CustomerViewReferralTab customer={customer} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default CustomerViewContent;
