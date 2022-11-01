import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@salesrep/redux/hooks';
import { getCommissionsEarned, getSales } from '@salesrep/redux/slices/salesrepSlice';
import React, { useEffect } from 'react';
import { useAuth } from '@shared/hooks/useAuth';

export function SalesRepDashboard() {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const sales = useAppSelector((state) => state.salesRep.sales);
    const commission = useAppSelector((state) => state.salesRep.commission);

    useEffect(() => {
        dispatch(getSales({ salesmanId: user.id }));
        dispatch(getCommissionsEarned({ salesmanId: user.id }));
    }, [dispatch, user.id]);

    return (
        <>
            <Grid sx={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #E0E0E0' }} width={'100%'}>
                <Typography variant={'h4'} fontWeight={500} mr={3} p={3}>
                    Dashboard
                </Typography>
            </Grid>
            <Grid container p={3} wrap={'nowrap'}>
                <Grid
                    md={6}
                    mr={1}
                    p={2}
                    border={'1px solid #E0E0E0'}
                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                >
                    <Grid container item justifyContent={'space-between'} alignItems={'center'}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#0000008A' }}>Sales</Typography>
                    </Grid>
                    <Grid display={'flex'} mt={2} alignItems={'center'}>
                        <Grid>
                            <Typography variant={'h4'} sx={{ fontSize: '36px' }}>
                                ${sales || 0}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container px={3} wrap={'nowrap'}>
                <Grid
                    md={6}
                    mr={1}
                    p={2}
                    border={'1px solid #E0E0E0'}
                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                >
                    <Grid container item justifyContent={'space-between'} alignItems={'center'}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#0000008A' }}>
                            Commission Earned
                        </Typography>
                    </Grid>
                    <Grid display={'flex'} mt={2} alignItems={'center'}>
                        <Grid>
                            <Typography variant={'h4'} sx={{ fontSize: '36px' }}>
                                ${commission || 0}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default SalesRepDashboard;
