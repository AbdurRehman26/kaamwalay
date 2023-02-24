import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ReferralProgramOverviewCard } from './ReferralProgramOverviewCard';

export function ReferralProgramOverview() {
    return (
        <Grid container>
            <Grid sx={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #E0E0E0' }} width={'100%'}>
                <Typography variant={'h4'} fontWeight={500} mr={3} p={3}>
                    Referral Overview
                </Typography>
            </Grid>
            <Grid container p={3} wrap={'nowrap'} spacing={2}>
                <Grid item container md={6}>
                    <ReferralProgramOverviewCard
                        title={'Orders'}
                        value={0}
                        timeFilters={true}
                        statName={'orders'}
                        formatAsCurrency={false}
                    />
                </Grid>
                <Grid item container md={6}>
                    <ReferralProgramOverviewCard title={'Sales'} value={0} timeFilters={true} statName={'sales'} />
                </Grid>
                {/* <Grid item container md={4}>*/}
                {/*    <ReferralProgramOverviewCard*/}
                {/*            title={'Withdrawable Commission'}*/}
                {/*            value={0}*/}
                {/*            statName={'withdrawable_commission'}*/}
                {/*    />*/}
                {/* </Grid>*/}
            </Grid>
            <Grid container p={3} wrap={'nowrap'} spacing={2}>
                <Grid item container md={6}>
                    <ReferralProgramOverviewCard
                        title={'Cards'}
                        value={0}
                        timeFilters={true}
                        statName={'cards'}
                        formatAsCurrency={false}
                    />
                </Grid>
                <Grid item container md={6}>
                    <ReferralProgramOverviewCard
                        title={'Commission Earned'}
                        value={0}
                        timeFilters={true}
                        statName={'commission_earned'}
                    />
                </Grid>
                {/* <Grid item container md={4}>*/}
                {/*    <ReferralProgramOverviewCard*/}
                {/*            title={'Commission Paid'}*/}
                {/*            value={0}*/}
                {/*            timeFilters={true}*/}
                {/*            statName={'commission_paid'}*/}
                {/*    />*/}
                {/* </Grid>*/}
            </Grid>
        </Grid>
    );
}

export default ReferralProgramOverview;
