import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
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
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useIsMounted } from '@shared/hooks/useIsMounted';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminCustomersQuery } from '@shared/redux/hooks/useCustomersQuery';
import { font } from '@shared/styles/utils';
import { CustomerAddDialog } from '@admin/components/Customer/CustomerAddDialog';
import { CustomerCardView } from './CustomerCardView';

interface SelectAndCreateCustomerDialogProps extends Omit<DialogProps, 'onSubmit'> {}
const debouncedFunc = debounce((func: () => void) => func(), 300);

export function SelectAndCreateCustomerDialog(props: SelectAndCreateCustomerDialogProps) {
    const { onClose, ...rest } = props;
    const [search, setSearch] = useState('');
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const isMounted = useIsMounted();

    const customers = useAdminCustomersQuery({
        ...bracketParams(),
    });

    const handleSearch = useCallback(
        (e) => {
            setSearch(e.target.value);
            debouncedFunc(() => {
                customers.search({ search });
            });
        },
        [setSearch, search, customers],
    );

    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    useEffect(
        () => {
            if (isMounted()) {
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <>
            <CustomerAddDialog open={showAddCustomer} fromSubmission={true} />
            <Dialog {...rest} fullWidth>
                <DialogTitle>
                    Select or Create a Customer
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
                <DialogContent>
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
                    {customers.data.length > 0 && search !== '' ? <CustomerCardView customer={customers.data} /> : null}
                    <Grid mt={3}>
                        <Button
                            onClick={() => setShowAddCustomer(true)}
                            sx={{ height: '48px' }}
                            fullWidth
                            variant={'contained'}
                            color={'primary'}
                        >
                            Create a new Customer
                        </Button>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} color={'inherit'}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
