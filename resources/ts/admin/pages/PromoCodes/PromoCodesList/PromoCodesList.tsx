import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PromoCodesListHeader from '@admin/pages/PromoCodes/PromoCodesList/PromoCodesListHeader';
import { SubmissionsTable } from '@admin/pages/Submissions/SubmissionsList/SubmissionsTable';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { PromoCodesTable } from '@admin/pages/PromoCodes/PromoCodesList/PromoCodesTable';
import { PromoCodeStatusEnum } from '@shared/constants/PromoCodeStatusEnum';

const TabContent = styled(TabPanel)(
    {
        padding: 0,
    },
    { name: 'TabContent' },
);

export function PromoCodesList() {
    const { tab } = useParams<{ tab: string }>();
    const [search, setSearch] = useState('');
    return (
        <TabContext value={tab}>
            <Grid container direction={'column'}>
                <PromoCodesListHeader onSearch={setSearch} />

                <Divider />
                <TabContent value={'all'}>
                    <PromoCodesTable search={search} all />
                </TabContent>
                <TabContent value={'active'}>
                    <PromoCodesTable search={search} tabFilter={PromoCodeStatusEnum.ACTIVE} />
                </TabContent>
                <TabContent value={'inactive'}>
                    <PromoCodesTable search={search} tabFilter={PromoCodeStatusEnum.INACTIVE} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default PromoCodesList;
