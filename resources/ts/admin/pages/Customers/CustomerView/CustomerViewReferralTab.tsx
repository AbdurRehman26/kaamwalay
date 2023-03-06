import Grid from '@mui/material/Grid';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { CustomerReferralOverviewCard } from '@admin/components/Customer/CustomerReferralOverviewCard';
import { CustomerReferralCommissionEarnings } from './CustomerReferralCommissionEarnings';
import { CustomerReferralSignUp } from './CustomerReferralSignUp';

interface CustomerViewReferralTabProps {
    customer: CustomerEntity;
}

export function CustomerViewReferralTab({ customer }: CustomerViewReferralTabProps) {
    return (
        <>
            <Grid container direction={'row'} spacing={2.5} p={3}>
                <Grid item container direction={'row'} spacing={2.5}>
                    <Grid item container md={4}>
                        <CustomerReferralOverviewCard
                            title={'Orders'}
                            value={customer.orders}
                            timeFilters={true}
                            statName={'orders'}
                            formatAsCurrency={false}
                        />
                    </Grid>
                    <Grid item container md={4}>
                        <CustomerReferralOverviewCard
                            title={'Sales'}
                            value={customer.sales}
                            timeFilters={true}
                            statName={'sales'}
                        />
                    </Grid>
                    <Grid item container md={4}>
                        <CustomerReferralOverviewCard
                            title={'Withdrawable Commission'}
                            value={0}
                            statName={'withdrawable_commission'}
                        />
                    </Grid>
                </Grid>
                <Grid item container direction={'row'} spacing={2.5}>
                    <Grid item container md={4}>
                        <CustomerReferralOverviewCard
                            title={'Cards'}
                            value={customer.cards}
                            timeFilters={true}
                            statName={'cards'}
                            formatAsCurrency={false}
                        />
                    </Grid>
                    <Grid item container md={4}>
                        <CustomerReferralOverviewCard
                            title={'Commission Earned'}
                            value={customer.unpaidCommissionTillLastMonth}
                            timeFilters={true}
                            statName={'commission_earned'}
                        />
                    </Grid>
                    <Grid item container md={4}>
                        <CustomerReferralOverviewCard
                            title={'Commission Paid'}
                            value={0}
                            timeFilters={true}
                            statName={'commission_paid'}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <CustomerReferralCommissionEarnings />
            <CustomerReferralSignUp />
        </>
    );
}

export default CustomerViewReferralTab;
