import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import { UserEntity } from '@shared/entities/UserEntity';

const useStyles = makeStyles({
    textColorSecondary: {
        color: '#0000008A',
    },
});
interface CustomerCardViewProps {
    customer?: UserEntity[] | null;
}

export function CustomerCardView(props: CustomerCardViewProps) {
    const classes = useStyles();
    const createSubmission = useCallback(async (customer: UserEntity) => {
        // window.location.href = `/dashboard/submissions/new?orderId=${customer}`;
    }, []);

    return (
        <>
            {props.customer?.map((customer: UserEntity) => {
                return (
                    <Grid
                        onClick={() => createSubmission(customer)}
                        container
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        sx={{ borderRadius: '4px', border: '1px solid #E0E0E0', borderBottom: 'none' }}
                        p={2}
                    >
                        <Grid display={'flex'}>
                            <Grid display={'flex'}>
                                <Avatar sx={{ height: '56px', width: '56px' }} src={customer.profileImage} />
                            </Grid>
                            <Grid ml={1}>
                                <Typography sx={{ fontSize: '12px' }}>{customer.getFullName()}</Typography>
                                <Typography sx={{ fontSize: '12px' }}>
                                    Customer Id:{' '}
                                    <span className={classes.textColorSecondary}>{customer.customerNumber}</span>{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '12px' }}>
                                    Email: <span className={classes.textColorSecondary}>{customer.email}</span>{' '}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid alignItems={'center'}>
                            <IconButton sx={{ color: '#0000008A' }} size="large">
                                <KeyboardArrowRightIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>
                );
            })}
        </>
    );
}
