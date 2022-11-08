import Grid from '@mui/material/Grid';
import { SalesRepOverviewCard } from '@admin/components/SalesRep';

export function SalesRepViewOverviewTab({ salesrep }) {
    const salesrepData = salesrep.data;

    return (
        <Grid container direction={'row'} spacing={2.5} p={3}>
            <Grid item container direction={'row'} spacing={2.5}>
                <Grid item container md={6}>
                    <SalesRepOverviewCard title={'Sales'} value={salesrepData.sales} />
                </Grid>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Unpaid Commission'}
                        value={'100'}
                        hint={
                            'Unpaid commission is calculated from fully paid orders up to the previous month. It does not include paid orders from the current month.'
                        }
                    />
                </Grid>
            </Grid>
            <Grid item container direction={'row'} spacing={2.5}>
                <Grid item container md={6}>
                    <SalesRepOverviewCard title={'Commission Earned'} value={salesrepData.commissionEarned} />
                </Grid>
                <Grid item container md={6}>
                    <SalesRepOverviewCard title={'Commission Paid'} value={'0'} />
                </Grid>
            </Grid>
        </Grid>
    );
}
