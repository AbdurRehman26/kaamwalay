import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SalesRepOverviewCard } from '@salesrep/components/Dashboard/SalesRepOverviewCard';
import React from 'react';
import { SalesRepCommissionPaymentsList } from '@shared/components/SalesReps/SalesRepCommissionPaymentsList';

export function SalesRepDashboard() {
    return (
        <>
            <Grid sx={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #E0E0E0' }} width={'100%'}>
                <Typography variant={'h4'} fontWeight={500} mr={3} p={3}>
                    Dashboard
                </Typography>
            </Grid>
            <Grid container p={3} wrap={'nowrap'} spacing={2}>
                <Grid item container md={6}>
                    <SalesRepOverviewCard title={'Sales'} value={0} timeFilters={true} statName={'sales'} />
                </Grid>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Unpaid Commission'}
                        hint={
                            'Unpaid commission is calculated from fully paid orders up to the previous month. It does not include paid orders from the current month.'
                        }
                        value={0}
                        statName={'commission_unpaid'}
                    />
                </Grid>
            </Grid>
            <Grid container p={3} wrap={'nowrap'} spacing={2}>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Commission Earned'}
                        value={0}
                        timeFilters={true}
                        statName={'commission_earned'}
                    />
                </Grid>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Paid Commission'}
                        value={0}
                        timeFilters={true}
                        statName={'commission_paid'}
                    />
                </Grid>
            </Grid>
            <Grid container p={3} wrap={'nowrap'}>
                <SalesRepCommissionPaymentsList />
            </Grid>
        </>
    );
}

export default SalesRepDashboard;
