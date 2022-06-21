import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';
import { useAppDispatch } from '@dashboard/redux/hooks';
import { getSavedAddresses, getSingleAddress } from '../../redux/slices/newAddressSlice';
import { AddAddressDialog } from './AddAddressDialog';
import DeleteAddressDialog from './DeleteAddressDialog';

type ExistingAddressProps = {
    firstName: string;
    lastName: string;
    address: string;
    flat: string;
    zip: string;
    city: string;
    country: { name: string; code: string; id: number; phoneCode: string };
    state: { name: string; code: string; id: number };
    stateName: string;
    id: number;
    phone: number;
    handleAddressDeleteSubmit(id: any): Promise<void> | void;
};

const useStyles = makeStyles(
    (theme) => ({
        levelTitle: {
            fontFamily: 'Roboto',
            transform: 'translateZ(0)',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        row: {
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
        },
    }),
    { name: 'PaymentCardItem' },
);

const Root = styled(Box)(({ theme }) => ({
    minWidth: '97%',
    backgroundColor: '#F9F9F9',
    border: '1px solid #E0E0E0',
    marginBottom: '12px',
    marginRight: '12px',
    borderRadius: '4px',
    padding: '10px',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

export function Address(props: ExistingAddressProps) {
    const classes = useStyles();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const dispatch = useAppDispatch();

    const loadAddresses = () => {
        dispatch(getSavedAddresses());
    };

    const handleEditAddressModal = () => {
        setShowEditAddressModal(true);
        dispatch(getSingleAddress(props.id));
    };

    return (
        <>
            <DeleteAddressDialog
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onSubmit={() => props.handleAddressDeleteSubmit(props.id)}
            />
            <Grid container item xs={12} sm={12} md={6} className={classes.container}>
                <Root>
                    <div className={classes.row}>
                        <Typography variant={'subtitle2'} className={classes.levelTitle}>
                            {props.firstName} {props.lastName}
                        </Typography>
                        <IconButton aria-label="delete" size="small" onClick={() => setShowDeleteModal(true)}>
                            <DeleteOutline fontSize="small" />
                        </IconButton>
                    </div>
                    <div>
                        <Typography variant={'body2'} color={'rgba(0, 0, 0, 0.87)'}>
                            {props.address}
                        </Typography>
                        <Typography variant={'body2'} color={'rgba(0, 0, 0, 0.87)'}>
                            {props.address}
                        </Typography>
                        <Typography variant={'body2'} color={'rgba(0, 0, 0, 0.87)'}>
                            {props.country.name}
                        </Typography>
                        <Typography variant={'body2'} color={'rgba(0, 0, 0, 0.87)'}>
                            +{props.phone}
                        </Typography>
                        <Grid>
                            <Button variant={'text'} size={'medium'} onClick={handleEditAddressModal}>
                                Edit
                            </Button>
                        </Grid>
                    </div>
                </Root>
            </Grid>
            <AddAddressDialog
                addressId={props.id}
                isUpdate={true}
                dialogTitle={'Update Shipping Address'}
                open={showEditAddressModal}
                onClose={() => setShowEditAddressModal(false)}
                onSubmit={() => loadAddresses()}
            />
        </>
    );
}
