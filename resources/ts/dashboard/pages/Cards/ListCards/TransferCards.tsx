import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import { find } from 'lodash';
import React, { useCallback, useState } from 'react';
import { UserEntity } from '@shared/entities/UserEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminCustomersQuery } from '@shared/redux/hooks/useCustomersQuery';
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
});
interface TransferCardsDialogProps extends Omit<DialogProps, 'onSubmit'> {
    changeCustomer?: boolean;
    userCards: any;
    selectedUserCardIds: [number?];
}
const debouncedFunc = debounce((func: () => void) => func(), 300);

export function TransferCardsDialog(props: TransferCardsDialogProps) {
    const { onClose, ...rest } = props;
    const [search, setSearch] = useState('');
    const [showCards, setShowCards] = useState(true);
    const classes = useStyles();
    const { userCards, selectedUserCardIds } = props;
    const firstCard = find(userCards, { id: selectedUserCardIds[0] });

    const customers = useAdminCustomersQuery({
        ...bracketParams(),
    });

    const handleSearch = useCallback(
        (e) => {
            setSearch(e.target.value);
            debouncedFunc(() => {
                customers.search({ search: e.target.value });
            });
        },
        [setSearch, customers],
    );

    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
            setSearch('');
        },
        [onClose],
    );

    return (
        <Dialog {...rest} fullWidth onClose={handleClose}>
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
                {showCards ? 'Cards in Transfer' : `Transfer Ownership of ${props.selectedUserCardIds?.length} Cards`}
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
                                    src={firstCard.cardProduct?.imagePath}
                                    alt={firstCard.cardProduct?.imagePath}
                                />
                                {firstCard.cardProduct.shortName}
                                {selectedUserCardIds.length > 1 ? `+ ${selectedUserCardIds.length - 1} More` : ''}
                            </Box>
                        ) : null}
                        <Grid mt={2} mb={2}>
                            <Typography variant={'body1'} className={font.fontWeightMedium}>
                                Select user to transfer
                            </Typography>
                            <TextField
                                fullWidth
                                variant={'outlined'}
                                size={'small'}
                                placeholder={'Search users...'}
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
                    </>
                ) : (
                    <>
                        {selectedUserCardIds?.map((userCardId, index) => (
                            <Box display={'flex'} alignItems={'center'}>
                                {index + 1}
                                <img
                                    className={classes.productImage}
                                    src={find(userCards, { id: userCardId }).cardProduct?.imagePath}
                                    alt={find(userCards, { id: userCardId }).cardProduct?.imagePath}
                                />
                                {find(userCards, { id: userCardId }).cardProduct?.shortName}
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
                            onClick={handleClose}
                            variant={'contained'}
                            disabled={true}
                            color={'inherit'}
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
