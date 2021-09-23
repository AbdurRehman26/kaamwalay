import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
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
        <TabContext value={tab}>
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
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.ARRIVED} />
                </TabContent>
                <TabContent value={'graded'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.GRADED} />
                </TabContent>
                <TabContent value={'shipped'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.SHIPPED} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default SubmissionsList;
