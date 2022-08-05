import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import theme from '@shared/styles/theme';

interface HeaderProps {
    onSearch?: (query: string) => void;
    headerStyles?: any;
    dataLength?: number;
    ordersCount?: number;
    tabs?: React.ReactNode;
    headerActions?: React.ReactNode;
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

export function Header({ onSearch, dataLength, ordersCount, headerActions, tabs, headerStyles }: HeaderProps) {
    const [search, setSearch] = useState('');
    const classes = useStyles();

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

    return (
        <Grid component={'header'} container sx={{ backgroundColor: headerStyles?.backgroundColor ?? '#f9f9f9' }}>
            <Grid container alignItems={'center'} sx={headerStyles?.header ?? styles.header}>
                <Grid item container xs alignItems={'center'}>
                    <Typography variant={'h4'} sx={headerStyles?.title ?? styles.title}>
                        Submissions
                    </Typography>
                    {dataLength !== 0 || ordersCount !== 0 ? (
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
                {headerActions}
            </Grid>
            {tabs}
        </Grid>
    );
}

export default Header;
