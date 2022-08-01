import SearchIcon from '@mui/icons-material/Search';
import TabList from '@mui/lab/TabList';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import theme from '@shared/styles/theme';

interface HeaderProps {
    onSearch?: (query: string) => void;
    isCustomerDetailPage?: boolean;
    dataLength?: number;
    ordersCount?: number;
}
const styles = {
    header: {
        padding: theme.spacing(3),
    },
    customerSearch: {
        padding: '0px',
    },
    scanButton: {
        borderRadius: 18,
    },
    searchField: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginLeft: theme.spacing(2),
    },
    CustomerTitle: {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '23px',
    },
    Title: {
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

export function Header({ onSearch, isCustomerDetailPage, dataLength, ordersCount }: HeaderProps) {
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
        <Grid component={'header'} container sx={{ backgroundColor: isCustomerDetailPage ? '#ffffff' : '#f9f9f9' }}>
            <Grid container alignItems={'center'} sx={isCustomerDetailPage ? styles.customerSearch : styles.header}>
                <Grid item container xs alignItems={'center'}>
                    <Typography variant={'h4'} sx={isCustomerDetailPage ? styles.CustomerTitle : styles.Title}>
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
                {!isCustomerDetailPage ? (
                    <Grid container item xs justifyContent={'flex-end'}>
                        <Tooltip title={'Coming Soon'}>
                            <span>
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    startIcon={<Icon>qr_code_scanner</Icon>}
                                    sx={styles.scanButton}
                                    disabled
                                >
                                    Scan Barcode
                                </Button>
                            </span>
                        </Tooltip>
                    </Grid>
                ) : null}
            </Grid>
            {!isCustomerDetailPage ? (
                <TabList indicatorColor={'primary'} textColor={'primary'}>
                    <Tab component={Link} to={'/submissions/all/list'} value={'all'} label="All" />
                    <Tab component={Link} to={'/submissions/pending/list'} value={'pending'} label="Pending" />
                    <Tab component={Link} to={'/submissions/reviewed/list'} value={'reviewed'} label="Reviewed" />
                    <Tab component={Link} to={'/submissions/graded/list'} value={'graded'} label="Graded" />
                    <Tab component={Link} to={'/submissions/shipped/list'} value={'shipped'} label="Shipped" />
                    <Tab component={Link} to={'/submissions/incomplete/list'} value={'incomplete'} label="Incomplete" />
                </TabList>
            ) : null}
        </Grid>
    );
}

export default Header;
