import Grid from '@mui/material/Grid';
import React from 'react';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { SalesRepOverviewCard } from '@admin/components/SalesRep';

interface CustomerViewReferralTabProps {
    customer: CustomerEntity;
}

export function CustomerViewReferralTab({ customer }: CustomerViewReferralTabProps) {
    return (
        <Grid container direction={'row'} spacing={2.5} p={3}>
            <Grid item container direction={'row'} spacing={2.5}>
                <Grid item container md={4}>
                    <SalesRepOverviewCard
                        title={'Orders'}
                        value={customer.orders}
                        timeFilters={true}
                        statName={'orders'}
                        formatAsCurrency={false}
                    />
                </Grid>
                <Grid item container md={4}>
                    <SalesRepOverviewCard
                        title={'Sales'}
                        value={customer.sales}
                        timeFilters={true}
                        statName={'sales'}
                    />
                </Grid>
                <Grid item container md={4}>
                    <SalesRepOverviewCard
                        title={'Withdrawable Commission'}
                        value={customer.unpaidCommission}
                        hint={
                            'Unpaid commission is calculated from fully paid orders up to the previous month. It does not include paid orders from the current month.'
                        }
                    />
                </Grid>
            </Grid>
            <Grid item container direction={'row'} spacing={2.5}>
                <Grid item container md={4}>
                    <SalesRepOverviewCard
                        title={'Cards'}
                        value={customer.cards}
                        timeFilters={true}
                        statName={'cards'}
                        formatAsCurrency={false}
                    />
                </Grid>
                {/* <Grid item container md={4}>
                    <SalesRepOverviewCard
                        title={'Commission Earned'}
                        value={customer.unpaidCommissionTillLastMonth}
                        timeFilters={true}
                        statName={'commission_earned'}
                    />
                </Grid>
                <Grid item container md={4}>
                    <SalesRepOverviewCard
                        title={'Commission Paid'}
                        timeFilters={true}
                        value={customer.paidCommission}
                        statName={'commission_paid'}
                    />
                </Grid> */}
            </Grid>
        </Grid>
    );
}

export default CustomerViewReferralTab;
