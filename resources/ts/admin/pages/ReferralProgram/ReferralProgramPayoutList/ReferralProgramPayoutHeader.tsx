import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { payReferralCommissions } from '@shared/redux/slices/adminReferralPayoutSlice';
import theme from '@shared/styles/theme';
import { useAppDispatch } from '@admin/redux/hooks';

interface HeaderProps {
    onSearch?: (query: string) => void;
    dataLength?: number;
    ordersExist?: boolean;
    tabs?: React.ReactNode;
}

const styles = {
    header: {
        padding: theme.spacing(3),
    },
    customerSearch: {
        padding: '0px',
    },
    searchField: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginLeft: theme.spacing(2),
    },
    title: {
        fontWeight: 500,
        fontSize: '32px',
        lineHeight: '44px',
    },
};

const useStyles = makeStyles(
    (theme) => ({
        searchFieldNotch: {
            borderRadius: 24,
        },
        searchFieldInput: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
            height: 24,
        },
    }),
    { name: 'Header' },
);

const debouncedFunc = debounce((func: any) => {
    func();
}, 300);

export function ReferralProgramPayoutHeader({ onSearch, dataLength, ordersExist, tabs }: HeaderProps) {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const dispatch = useAppDispatch();

    const handleSearch = useCallback(
        (e) => {
            setSearch(e.target.value);
            if (onSearch) {
                debouncedFunc(() => {
                    onSearch(e.target.value);
                });
            }
        },
        [setSearch, onSearch],
    );

    const handlePayReferralCommissions = () => {
        dispatch(payReferralCommissions({ items: [], allPending: true }));
    };

    return (
        <Grid component={'header'} container sx={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #E0E0E0' }}>
            <Grid container alignItems={'center'} sx={styles.header}>
                <Grid item container xs alignItems={'center'}>
                    <Typography variant={'h4'} sx={styles.title}>
                        Payouts
                    </Typography>
                    {dataLength !== 0 || ordersExist ? (
                        <TextField
                            variant={'outlined'}
                            onChange={handleSearch}
                            value={search}
                            placeholder={'Search...'}
                            sx={styles.searchField}
                            InputProps={{
                                classes: {
                                    input: classes.searchFieldInput,
                                    notchedOutline: classes.searchFieldNotch,
                                },
                                startAdornment: (
                                    <InputAdornment position={'start'}>
                                        <SearchIcon color={'inherit'} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    ) : null}
                </Grid>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    sx={{ borderRadius: '24px', padding: '12px 24px', marginLeft: '10px' }}
                    onClick={() => handlePayReferralCommissions()}
                >
                    Pay All Pending
                </Button>
            </Grid>
            {tabs}
        </Grid>
    );
}
