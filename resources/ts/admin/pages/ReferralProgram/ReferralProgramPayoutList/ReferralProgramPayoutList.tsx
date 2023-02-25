import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { PayoutStatusEnum } from '@shared/constants/PayoutStatusEnum';
import { ReferralProgramPayoutHeader } from './ReferralProgramPayoutHeader';
import { ReferralProgramPayoutTable } from './ReferralProgramPayoutTable';

const TabContent = styled(TabPanel)(
    {
        padding: 0,
    },
    { name: 'TabContent' },
);

export function ReferralProgramPayoutList() {
    const { tab } = useParams<{ tab: string }>();
    const [search, setSearch] = useState('');

    const tabs = (
        <TabList indicatorColor={'primary'} textColor={'primary'}>
            <Tab component={Link} to={'/referral-program/payouts/pending/list'} value={'pending'} label="Pending" />
            <Tab
                component={Link}
                to={'/referral-program/payouts/completed/list'}
                value={'completed'}
                label="Completed"
            />
            <Tab
                component={Link}
                disabled
                to={'/referral-program/payouts/archived/list'}
                value={'archived'}
                label="Archived"
            />
        </TabList>
    );

    return (
        <TabContext value={tab ?? 'pending'}>
            <Grid container direction={'column'}>
                <ReferralProgramPayoutHeader tabs={tabs} onSearch={setSearch} />
                <TabContent value={'pending'}>
                    <ReferralProgramPayoutTable search={search} tabFilter={PayoutStatusEnum.PENDING} />
                </TabContent>
                <TabContent value={'completed'}>
                    <ReferralProgramPayoutTable search={search} tabFilter={PayoutStatusEnum.COMPLETED} />
                </TabContent>
                <TabContent value={'archived'}>
                    <ReferralProgramPayoutTable search={search} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}

export default ReferralProgramPayoutList;
