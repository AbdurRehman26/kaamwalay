import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';
import { useAppDispatch } from '@dashboard/redux/hooks';
import { getSavedAddresses, getSingleAddress, getStatesList } from '../../redux/slices/newAddressSlice';
import { AddAddressDialog } from './AddAddressDialog';
import DeleteAddressDialog from './DeleteAddressDialog';

type ExistingAddressProps = {
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
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
        nameClass: {
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
            marginLeft: '10px',
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '-2px',
        },
        item: {
            marginLeft: '10px',
            marginTop: '4px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        btnClass: {
            marginTop: '10px',
            marginLeft: '-5px',
        },
    }),
    { name: 'PaymentCardItem' },
);

const Root = styled(Box)(({ theme }) => ({
    minWidth: '97%',
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
    const [isLoading, setIsLoading] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const dispatch = useAppDispatch();

    const loadAddresses = () => {
        dispatch(getSavedAddresses());
    };

    const handleEditAddressModal = async () => {
        try {
            setIsLoading(true);
            await dispatch(getSingleAddress(props.id));
            await dispatch(getStatesList());
            await setShowEditAddressModal(true);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            setShowEditAddressModal(true);
        }
    };

    return (
        <>
            {!isLoading ? (
                <>
                    <DeleteAddressDialog
                        open={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onSubmit={() => props.handleAddressDeleteSubmit(props.id)}
                    />
                    <Grid container item xs={12} sm={12} md={6}>
                        <Root>
                            <Box className={classes.row}>
                                <Typography variant={'subtitle2'} className={classes.nameClass}>
                                    {props.firstName} {props.lastName}
                                </Typography>
                                <IconButton
                                    sx={{ marginRight: '8px' }}
                                    aria-label="delete"
                                    size="small"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <DeleteOutline fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant={'body2'} className={classes.item}>
                                {props.address} {props.address2}.
                            </Typography>
                            <Typography variant={'body2'} className={classes.item}>
                                {props.state.code}, {props.zip}
                            </Typography>
                            <Typography variant={'body2'} className={classes.item}>
                                {props.country.name}
                            </Typography>
                            <Typography variant={'body2'} className={classes.item}>
                                {props.phone}
                            </Typography>
                            <div className={classes.btnClass}>
                                <Button variant={'text'} size={'medium'} onClick={handleEditAddressModal}>
                                    Edit
                                </Button>
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
            ) : (
                <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
}
