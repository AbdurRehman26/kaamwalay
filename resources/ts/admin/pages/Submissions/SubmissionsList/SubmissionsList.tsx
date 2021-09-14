import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
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

    return (
        <TabContext value={tab}>
            <Grid container direction={'column'}>
                <SubmissionsListHeader />
                <Divider />
                <TabContent value={'all'}>
                    <SubmissionsTable all />
                </TabContent>
                <TabContent value={'pending'}>
                    <SubmissionsTable tabFilter={OrderStatusEnum.PAYMENT_PENDING} />
                </TabContent>
                <TabContent value={'reviewed'}>
                    <SubmissionsTable tabFilter={OrderStatusEnum.ARRIVED} />
                </TabContent>
                <TabContent value={'graded'}>
                    <SubmissionsTable tabFilter={OrderStatusEnum.GRADED} />
                </TabContent>
                <TabContent value={'shipped'}>
                    <SubmissionsTable tabFilter={OrderStatusEnum.SHIPPED} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default SubmissionsList;
