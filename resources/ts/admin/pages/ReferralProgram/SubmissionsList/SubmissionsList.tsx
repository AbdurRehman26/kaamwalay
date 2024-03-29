import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@shared/components/Customers/Header';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
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

    const tabs = (
        <TabList indicatorColor={'primary'} textColor={'primary'}>
            <Tab component={Link} to={'/referral-program/submissions/all/list'} value={'all'} label="All" />
            <Tab component={Link} to={'/referral-program/submissions/pending/list'} value={'pending'} label="Pending" />
            <Tab
                component={Link}
                to={'/referral-program/submissions/reviewed/list'}
                value={'reviewed'}
                label="Reviewed"
            />
            <Tab component={Link} to={'/referral-program/submissions/graded/list'} value={'graded'} label="Graded" />
            <Tab
                component={Link}
                to={'/referral-program/submissions/assembled/list'}
                value={'assembled'}
                label="Assembled"
            />
            <Tab component={Link} to={'/referral-program/submissions/shipped/list'} value={'shipped'} label="Shipped" />
        </TabList>
    );

    return (
        <TabContext value={tab ?? 'all'}>
            <Grid container direction={'column'}>
                <Header onSearch={setSearch} tabs={tabs} title={'Referral Orders'} />
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
                <TabContent value={'assembled'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.ASSEMBLED} />
                </TabContent>
                <TabContent value={'shipped'}>
                    <SubmissionsTable search={search} tabFilter={OrderStatusEnum.SHIPPED} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default SubmissionsList;
