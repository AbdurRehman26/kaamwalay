import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserEntity } from '@shared/entities/UserEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminCustomersQuery } from '@shared/redux/hooks/useCustomersQuery';
import { emptyUser, setUser } from '@shared/redux/slices/adminCreateOrderSlice';
import { resetSelectedExistingAddress, setUseCustomShippingAddress } from '@shared/redux/slices/adminCreateOrderSlice';
import { font } from '@shared/styles/utils';
import { CustomerAddDialog } from '@admin/components/Customer/CustomerAddDialog';
import { SalesRepAddDialog } from '@admin/pages/SalesReps/SalesRepsList/SalesRepAddDialog';
import { useAppDispatch } from '@admin/redux/hooks';

const useStyles = makeStyles({
    textColorSecondary: {
        color: '#0000008A',
    },
});
interface SelectAndCreateCustomerDialogProps extends Omit<DialogProps, 'onSubmit'> {
    changeCustomer?: boolean;
    fromSalesReps?: boolean;
    btnText: string;
}
const debouncedFunc = debounce((func: () => void) => func(), 300);

export function SelectAndCreateCustomerDialog(props: SelectAndCreateCustomerDialogProps) {
    const { onClose, ...rest } = props;
    const [search, setSearch] = useState('');
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showAddSalesRep, setShowAddSalesRep] = useState(false);
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const customers = useAdminCustomersQuery({
        ...bracketParams(),
    });

    const createSubmission = (customer: UserEntity) => {
        dispatch(setUser(customer));
        if (props.changeCustomer) {
            navigate(`/submissions/${customer.id}/new`, { state: { from: 'submission' } });
            handleClose('escapeKeyDown');
            dispatch(resetSelectedExistingAddress());
            dispatch(setUseCustomShippingAddress(false));
        } else if (props.fromSalesReps) {
            setShowAddSalesRep(true);
        } else {
            navigate(`/submissions/${customer.id}/new`, { state: { from: 'submission' } });
            handleClose('escapeKeyDown');
        }
    };

    const handleSearch = useCallback(
        (e) => {
            setSearch(e.target.value);
            debouncedFunc(() => {
                customers.search({ search: e.target.value });
            });
        },
        [setSearch, customers],
    );

    const setShowSalesRep = useCallback(() => {
        setShowAddSalesRep(true);
        dispatch(
            emptyUser({
                fullName: '',
                email: '',
                profileImage: '',
                customerNumber: '',
                id: -1,
            }),
        );
    }, [dispatch]);

    const handleClose = useCallback(
        (event: {}) => {
            dispatch(
                emptyUser({
                    fullName: '',
                    email: '',
                    profileImage: '',
                    customerNumber: '',
                    id: -1,
                }),
            );
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
            setSearch('');
        },
        [onClose, dispatch],
    );

    return (
        <>
            {props.fromSalesReps ? (
                <SalesRepAddDialog
                    onSubmit={() => {
                        window.location.reload();
                    }}
                    open={showAddSalesRep}
                    onClose={() => setShowAddSalesRep(false)}
                />
            ) : (
                <CustomerAddDialog
                    onClose={() => setShowAddCustomer(false)}
                    open={showAddCustomer}
                    fromSubmission={true}
                />
            )}
            {!showAddCustomer ? (
                <Dialog {...rest} fullWidth onClose={handleClose}>
                    <DialogTitle>
                        {props.fromSalesReps ? 'Search User or Create a New User' : 'Select or Create a Customer'}
                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: 'black',
                            }}
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ overflow: 'none' }}>
                        <Grid mt={2} mb={2}>
                            <Typography variant={'body1'} className={font.fontWeightMedium}>
                                Search
                            </Typography>
                            <TextField
                                fullWidth
                                variant={'outlined'}
                                size={'small'}
                                placeholder={'Search for a Customer...'}
                                value={search}
                                onChange={(e) => handleSearch(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            <SearchIcon color={'disabled'} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        {customers.data.length > 0 && search !== '' ? (
                            <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#000000DE' }}>
                                {' '}
                                {customers.data.length} results{' '}
                            </Typography>
                        ) : null}

                        <Grid
                            mt={1}
                            mb={1.5}
                            maxHeight={'400px'}
                            sx={{ overflowY: 'auto', scrollbarGutter: 'auto', scrollbarWidth: 'none' }}
                        >
                            {search !== '' &&
                                customers.data.map((customer: UserEntity) => {
                                    return (
                                        <Grid
                                            key={customer.id}
                                            onClick={() => createSubmission(customer)}
                                            container
                                            flexDirection={'row'}
                                            justifyContent={'space-between'}
                                            sx={{
                                                borderTopLeftRadius: customers.data[0].id === customer.id ? '4px' : '',
                                                borderTopRightRadius: customers.data[0].id === customer.id ? '4px' : '',
                                                borderBottomLeftRadius:
                                                    customers.data[customers.data.length - 1].id === customer.id
                                                        ? '4px'
                                                        : '',
                                                borderBottomRightRadius:
                                                    customers.data[customers.data.length - 1].id === customer.id
                                                        ? '4px'
                                                        : '',
                                                borderLeft: '1px solid #E0E0E0',
                                                borderRight: '1px solid #E0E0E0',
                                                borderBottom:
                                                    customers.data[customers.data.length - 1].id === customer.id
                                                        ? '1px solid #E0E0E0'
                                                        : '',
                                                borderTop: '1px solid #E0E0E0',
                                            }}
                                            p={2}
                                        >
                                            <Grid display={'flex'}>
                                                <Grid display={'flex'}>
                                                    <Avatar
                                                        sx={{ height: '56px', width: '56px' }}
                                                        src={customer.profileImage}
                                                    >
                                                        {customer.getInitials()}
                                                    </Avatar>
                                                </Grid>
                                                <Grid ml={1}>
                                                    <Typography sx={{ fontSize: '12px' }}>
                                                        {customer.getFullName()}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '12px' }}>
                                                        Customer Id:{' '}
                                                        <span className={classes.textColorSecondary}>
                                                            {customer.customerNumber}
                                                        </span>{' '}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '12px' }}>
                                                        Email:{' '}
                                                        <span className={classes.textColorSecondary}>
                                                            {customer.email}
                                                        </span>{' '}
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
                        </Grid>
                        {!props.changeCustomer ? (
                            <Grid position={'sticky'} sx={{ bottom: '0' }} mt={3}>
                                <Button
                                    onClick={props.fromSalesReps ? setShowSalesRep : () => setShowAddCustomer(true)}
                                    // onClick={handleAddDialog}
                                    sx={{ height: '48px' }}
                                    fullWidth
                                    variant={'contained'}
                                    color={'primary'}
                                >
                                    {props.btnText}
                                </Button>
                            </Grid>
                        ) : null}
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={handleClose} color={'inherit'}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : null}
        </>
    );
}
