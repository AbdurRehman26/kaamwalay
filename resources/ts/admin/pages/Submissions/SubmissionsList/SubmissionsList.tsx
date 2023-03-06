import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@shared/components/Customers/Header';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { SelectAndCreateCustomerDialog } from '../CreateSubmission/SelectAndCreateCustomerDialog';
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
    const [createSubmission, setCreateSubmission] = useState(false);

    const tabs = (
        <TabList indicatorColor={'primary'} textColor={'primary'}>
            <Tab component={Link} to={'/submissions/all/list'} value={'all'} label="All" />
            <Tab component={Link} to={'/submissions/pending/list'} value={'pending'} label="Pending" />
            <Tab component={Link} to={'/submissions/reviewed/list'} value={'reviewed'} label="Reviewed" />
            <Tab component={Link} to={'/submissions/graded/list'} value={'graded'} label="Graded" />
            <Tab component={Link} to={'/submissions/assembled/list'} value={'assembled'} label="Assembled" />
            <Tab component={Link} to={'/submissions/shipped/list'} value={'shipped'} label="Shipped" />
        </TabList>
    );

    const headerActions = (
        <Grid container item xs alignItems={'center'} justifyContent={'flex-end'}>
            <Tooltip title={'Coming Soon'}>
                <span>
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        startIcon={<Icon>qr_code_scanner</Icon>}
                        sx={{ borderRadius: 18 }}
                        disabled
                    >
                        Scan Barcode
                    </Button>
                </span>
            </Tooltip>
            <Button
                variant={'contained'}
                color={'primary'}
                sx={{ borderRadius: '24px', padding: '10px 20px', marginLeft: '10px' }}
                onClick={() => setCreateSubmission(true)}
            >
                CREATE SUBMISSION
            </Button>
        </Grid>
    );

    return (
        <TabContext value={tab ?? 'all'}>
            <Grid container direction={'column'}>
                <Header onSearch={setSearch} tabs={tabs} headerActions={headerActions} />
                <SelectAndCreateCustomerDialog
                    btnText={'Create a new Customer'}
                    onClose={() => setCreateSubmission(false)}
                    open={createSubmission}
                />
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
