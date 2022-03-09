import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { SubmissionsListHeader } from './SubmissionsListHeader';
import { SubmissionsTable } from './SubmissionsTable';

const TabContent = styled(TabPanel)(
    {
        padding: 0,
    },
    { name: 'TabContent' },
);

export function SubmissionsList() {
    const { tab } = useParams<{ tab: string }>();
    const [search, setSearch] = useState('');
    return (
        <TabContext value={tab ?? 'all'}>
            <Grid container direction={'column'}>
                <SubmissionsListHeader onSearch={setSearch} />

                <Divider />
                <TabContent value={'all'}>
                    <SubmissionsTable search={search} all />
                </TabContent>
                <TabContent value={'pending'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.PLACED} />
                </TabContent>
                <TabContent value={'reviewed'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.CONFIRMED} />
                </TabContent>
                <TabContent value={'graded'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.GRADED} />
                </TabContent>
                <TabContent value={'shipped'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.SHIPPED} />
                </TabContent>
                <TabContent value={'incomplete'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.PAYMENT_PENDING} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default SubmissionsList;
