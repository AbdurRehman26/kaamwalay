import Grid from '@mui/material/Grid';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { SalesRepOverviewCard } from '@admin/components/SalesRep';
import { CommissionPaymentsTable } from '@admin/pages/SalesReps/SalesRepView/CommissionPaymentsTable';

interface SalesRepViewOverviewTabProps {
    salesrep: SalesRepEntity;
}

export function SalesRepViewOverviewTab({ salesrep }: SalesRepViewOverviewTabProps) {
    return (
        <Grid container direction={'row'} spacing={2.5} p={3}>
            <Grid item container direction={'row'} spacing={2.5}>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Sales'}
                        value={salesrep.sales}
                        timeFilters={true}
                        statName={'sales'}
                    />
                </Grid>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Unpaid Commission'}
                        value={100}
                        hint={
                            'Unpaid commission is calculated from fully paid orders up to the previous month. It does not include paid orders from the current month.'
                        }
                    />
                </Grid>
            </Grid>
            <Grid item container direction={'row'} spacing={2.5}>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Commission Earned'}
                        value={salesrep.commissionEarned}
                        timeFilters={true}
                        statName={'commission_earned'}
                    />
                </Grid>
                <Grid item container md={6}>
                    <SalesRepOverviewCard title={'Commission Paid'} value={0} />
                </Grid>
                <CommissionPaymentsTable />
            </Grid>
        </Grid>
    );
}
