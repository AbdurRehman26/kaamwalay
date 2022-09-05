import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { UserEntity } from '@shared/entities/UserEntity';

interface CustomerCardViewProps {
    customer?: UserEntity[] | null;
}

export function CustomerCardView(props: CustomerCardViewProps) {
    return (
        <>
            {props.customer?.map((customer: UserEntity) => {
                return (
                    <Grid container flexDirection={'row'} justifyContent={'space-between'}>
                        <Grid display={'flex'}>
                            <Grid display={'flex'}>
                                <Avatar src={customer.profileImage} />
                            </Grid>
                            <Grid>
                                <Typography>{customer.getFullName}</Typography>
                                <Typography>Customer Id: {customer.customerNumber}</Typography>
                                <Typography>Email: {customer.email}</Typography>
                            </Grid>
                        </Grid>
                        <Grid alignItems={'center'}>
                            <IconButton size="large">
                                <KeyboardArrowRightIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>
                );
            })}
        </>
    );
}
