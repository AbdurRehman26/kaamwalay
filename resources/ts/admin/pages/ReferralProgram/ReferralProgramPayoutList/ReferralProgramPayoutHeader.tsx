import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
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
    onSearch: (query: string) => void;
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
    headerStyle: {
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #E0E0E0',
    },
    payoutButton: {
        borderRadius: '24px',
        padding: '12px 24px',
        marginLeft: '10px',
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

export function ReferralProgramPayoutHeader({ onSearch, tabs }: HeaderProps) {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

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

    const handlePayReferralCommissions = async () => {
        setLoading(true);
        await dispatch(payReferralCommissions({ allPending: true }));
        window.location.reload();
    };

    return (
        <Grid component={'header'} container sx={styles.headerStyle}>
            <Grid container alignItems={'center'} sx={styles.header}>
                <Grid item container xs alignItems={'center'}>
                    <Typography variant={'h4'} sx={styles.title}>
                        Payouts
                    </Typography>
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
                </Grid>
                <LoadingButton
                    loading={loading}
                    variant={'contained'}
                    color={'primary'}
                    sx={styles.payoutButton}
                    onClick={() => handlePayReferralCommissions()}
                >
                    Pay All Pending
                </LoadingButton>
            </Grid>
            {tabs}
        </Grid>
    );
}
