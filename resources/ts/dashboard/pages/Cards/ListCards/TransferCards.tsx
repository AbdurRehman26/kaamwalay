import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { plainToInstance } from 'class-transformer';
import { find } from 'lodash';
import React, { useCallback, useState } from 'react';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { APIService } from '@shared/services/APIService';
import { font } from '@shared/styles/utils';

const useStyles = makeStyles({
    textColorSecondary: {
        color: '#0000008A',
    },
    productImage: {
        padding: 8,
        width: '40px',
        height: '56px',
        objectFit: 'contain',
        objectPosition: 'center center',
    },
    userNotFound: {
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        backgroundColor: '#F5F5F5',
    },
});
interface TransferCardsDialogProps extends DialogProps {
    changeCustomer?: boolean;
    userCards: any;
    selectedUserCardIds: [number?];
    handleSubmit: any;
}

export function TransferCardsDialog({
    onClose,
    handleSubmit,
    userCards,
    selectedUserCardIds,
    ...rest
}: TransferCardsDialogProps) {
    const [search, setSearch] = useState('');
    const [showCards, setShowCards] = useState(false);
    const classes = useStyles();
    const firstCard = find(userCards, { id: selectedUserCardIds[0] });
    const [user, setUser] = useState<UserEntity | null>(null);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const apiService = useInjectable(APIService);
    const notifications = useNotifications();
    const [customers, setCustomers] = useState<UserEntity[]>([]);
    const [noUserFound, setNoUserFound] = useState(false);

    const handleSearch = useCallback(
        async (e) => {
            setCustomers([]);
            if (!e.target.value || e.key !== 'Enter') {
                return;
            }

            try {
                const endpoint = apiService.createEndpoint(
                    `customer?filter[email_or_customer_number]=${e.target.value}`,
                    {
                        version: 'v3',
                    },
                );
                const {
                    data: { data },
                } = await endpoint.get('');
                setCustomers(data.map((customer: any) => plainToInstance(CustomerEntity, customer)));
                setNoUserFound(data.length === 0);
            } catch (e: any) {
                notifications.exception(e);
            }
        },
        [apiService, notifications],
    );

    const notFoundElement = (
        <Stack p={3} className={classes.userNotFound} alignItems={'center'} justifyContent={'center'}>
            <Typography
                mt={1}
                letterSpacing={'0.2px'}
                lineHeight={'20px'}
                variant={'subtitle1'}
                fontSize={14}
                fontWeight={500}
            >
                User not found
            </Typography>
            <Typography
                variant={'caption'}
                width={'70%'}
                color={'textSecondary'}
                letterSpacing={'0.2px'}
                lineHeight={'20px'}
                fontSize={14}
                align={'center'}
            >
                Please make sure you have the correct email or customer ID, and try again.
            </Typography>
        </Stack>
    );

    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
            setShowCards(false);
            setSearch('');
            setUser(null);
            setCustomers([]);
        },
        [onClose],
    );

    const onSubmit = useCallback(() => {
        handleSubmit(user);
        setUser(null);
        setSearch('');
    }, [handleSubmit, user]);

    return (
        <Dialog {...rest} fullScreen={isSm} fullWidth onClose={handleClose}>
            <DialogTitle>
                {showCards && (
                    <IconButton
                        sx={{
                            color: 'black',
                        }}
                        onClick={() => setShowCards(false)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                )}
                {showCards ? 'Cards in Transfer' : `Transfer Ownership of ${selectedUserCardIds?.length} Cards`}
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
                {!showCards ? (
                    <>
                        {firstCard ? (
                            <Box display={'flex'} alignItems={'center'}>
                                <img
                                    className={classes.productImage}
                                    src={firstCard.cardProduct.imagePath}
                                    alt={firstCard.cardProduct.imagePath}
                                />
                                {firstCard.cardProduct.name}
                                {selectedUserCardIds.length > 1 ? (
                                    <Link
                                        sx={{ color: 'black', marginLeft: 1, textDecoration: 'underline !important' }}
                                        component={'button'}
                                        variant="body2"
                                        underline={'always'}
                                        onClick={() => setShowCards(true)}
                                    >
                                        +{selectedUserCardIds.length - 1} More{' '}
                                    </Link>
                                ) : (
                                    ''
                                )}
                            </Box>
                        ) : null}
                        {!user ? (
                            <>
                                <Grid mt={2} mb={2}>
                                    <Typography variant={'body1'} className={font.fontWeightMedium}>
                                        Select user to transfer to
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        variant={'outlined'}
                                        size={'small'}
                                        placeholder={'Search users...'}
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                        }}
                                        onKeyUp={handleSearch}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position={'start'}>
                                                    <SearchIcon color={'disabled'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                {customers.length > 0 && search !== '' ? (
                                    <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#000000DE' }}>
                                        {' '}
                                        {customers.length} results{' '}
                                    </Typography>
                                ) : null}

                                <Grid
                                    mt={1}
                                    mb={1.5}
                                    maxHeight={'400px'}
                                    sx={{ overflowY: 'auto', scrollbarGutter: 'auto', scrollbarWidth: 'none' }}
                                >
                                    {search !== '' &&
                                        customers.map((customer: UserEntity) => {
                                            return (
                                                <Grid
                                                    key={customer.id}
                                                    container
                                                    flexDirection={'row'}
                                                    justifyContent={'space-between'}
                                                    sx={{
                                                        borderTopLeftRadius:
                                                            customers[0].id === customer.id ? '4px' : '',
                                                        borderTopRightRadius:
                                                            customers[0].id === customer.id ? '4px' : '',
                                                        borderBottomLeftRadius:
                                                            customers[customers.length - 1].id === customer.id
                                                                ? '4px'
                                                                : '',
                                                        borderBottomRightRadius:
                                                            customers[customers.length - 1].id === customer.id
                                                                ? '4px'
                                                                : '',
                                                        borderLeft: '1px solid #E0E0E0',
                                                        borderRight: '1px solid #E0E0E0',
                                                        borderBottom:
                                                            customers[customers.length - 1].id === customer.id
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
                                                                <span className={classes.textColorSecondary}>
                                                                    {customer.customerNumber}
                                                                </span>
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '12px' }}>
                                                                <span className={classes.textColorSecondary}>
                                                                    {customer.email}
                                                                </span>
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid alignItems={'center'}>
                                                        <Button
                                                            onClick={() => setUser(customer)}
                                                            sx={{ minWidth: '92px', padding: '10px' }}
                                                            variant={'outlined'}
                                                            color={'primary'}
                                                        >
                                                            Select User
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })}

                                    {noUserFound && notFoundElement}
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Typography fontWeight={500} fontSize={14}>
                                    Transfer To
                                </Typography>
                                <Grid
                                    key={user.id}
                                    container
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    sx={{
                                        padding: '12px',
                                        borderRadius: '4px',
                                        border: '1px solid #E0E0E0',
                                    }}
                                >
                                    <Grid display={'flex'}>
                                        <Grid display={'flex'}>
                                            <Avatar sx={{ height: '56px', width: '56px' }} src={user.profileImage}>
                                                {user.getInitials()}
                                            </Avatar>
                                        </Grid>
                                        <Grid
                                            ml={1}
                                            display={'flex'}
                                            alignItems={'baseline'}
                                            flexDirection={'column'}
                                            justifyContent={'center'}
                                        >
                                            <Typography sx={{ fontSize: '12px' }}>{user.getFullName()}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>
                                                <span className={classes.textColorSecondary}>
                                                    {user.customerNumber}
                                                </span>
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px' }}>
                                                <span className={classes.textColorSecondary}>{user.email}</span>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid display={'flex'} alignItems={'center'}>
                                        <IconButton>
                                            <DeleteOutlineIcon onClick={() => setUser(null)} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {selectedUserCardIds?.map((userCardId, index) => (
                            <Box display={'flex'} alignItems={'center'}>
                                {index + 1}
                                <img
                                    className={classes.productImage}
                                    src={find(userCards, { id: userCardId }).cardProduct.imagePath}
                                    alt={find(userCards, { id: userCardId }).cardProduct.imagePath}
                                />
                                {find(userCards, { id: userCardId }).cardProduct.name}
                            </Box>
                        ))}
                    </>
                )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ padding: '18px' }}>
                {!showCards ? (
                    <>
                        <Button onClick={handleClose} color={'inherit'}>
                            Cancel
                        </Button>
                        <Button
                            sx={{ padding: '10px' }}
                            onClick={onSubmit}
                            variant={'contained'}
                            disabled={!user}
                            color={'primary'}
                        >
                            TRANSFER OWNERSHIP
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleClose} color={'inherit'}>
                        Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
