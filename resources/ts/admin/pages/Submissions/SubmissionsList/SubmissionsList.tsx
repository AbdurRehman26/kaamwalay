import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import { useParams } from 'react-router-dom';
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
                    <SubmissionsTable tabFilter={'all'} />
                </TabContent>
                <TabContent value={'pending'}>
                    <SubmissionsTable tabFilter={'pending'} />
                </TabContent>
                <TabContent value={'reviewed'}>
                    <SubmissionsTable tabFilter={'reviewed'} />
                </TabContent>
                <TabContent value={'graded'}>
                    <SubmissionsTable tabFilter={'graded'} />
                </TabContent>
                <TabContent value={'shipped'}>
                    <SubmissionsTable tabFilter={'shipped'} />
                </TabContent>
            </Grid>
        </TabContext>
    );
}
export default SubmissionsList;
