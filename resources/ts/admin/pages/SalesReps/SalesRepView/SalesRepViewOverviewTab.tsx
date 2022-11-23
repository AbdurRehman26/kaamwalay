import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { SalesRepCommissionPaymentsList } from '@shared/components/SalesReps/SalesRepCommissionPaymentsList';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { SalesRepOverviewCard } from '@admin/components/SalesRep';
import { AddCommissionPaymentDialog } from '@admin/pages/SalesReps/SalesRepView/AddCommissionPaymentDialog';

interface SalesRepViewOverviewTabProps {
    salesrep: SalesRepEntity;
}

export function SalesRepViewOverviewTab({ salesrep }: SalesRepViewOverviewTabProps) {
    const [showAddCommissionPayment, setShowAddCommissionPayment] = useState(false);

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
                        value={salesrep.unpaidCommission}
                        hint={
                            'Unpaid commission is calculated from fully paid orders up to the previous month. It does not include paid orders from the current month.'
                        }
                        addButton={true}
                        onAddButtonClick={() => setShowAddCommissionPayment(true)}
                    />
                </Grid>
            </Grid>
            <Grid item container direction={'row'} spacing={2.5}>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Commission Earned'}
                        value={salesrep.unpaidCommissionTillLastMonth}
                        timeFilters={true}
                        statName={'commission_earned'}
                    />
                </Grid>
                <Grid item container md={6}>
                    <SalesRepOverviewCard
                        title={'Commission Paid'}
                        timeFilters={true}
                        value={salesrep.paidCommission}
                        statName={'commission_paid'}
                    />
                </Grid>
            </Grid>
            <Grid item container direction={'row'}>
                <SalesRepCommissionPaymentsList isAdmin />
            </Grid>
            <AddCommissionPaymentDialog
                onSubmit={() => {
                    window.location.reload();
                }}
                open={showAddCommissionPayment}
                onClose={() => setShowAddCommissionPayment(false)}
            />
        </Grid>
    );
}
