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
import { font } from '@shared/styles/utils';

interface SubmissionsListHeaderProps {
    onSearch?: (query: string) => void;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            backgroundColor: '#f9f9f9',
        },
        header: {
            padding: theme.spacing(3),
        },
        scanButton: {
            borderRadius: 18,
        },
        searchField: {
            backgroundColor: '#fff',
            borderRadius: 24,
            marginLeft: theme.spacing(2),
        },
        searchFieldNotch: {
            borderRadius: 24,
        },
        searchFieldInput: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
            height: 24,
        },
    }),
    { name: 'SubmissionsListHeader' },
);

const debouncedFunc = debounce((func: any) => {
    func();
}, 300);

export function SubmissionsListHeader({ onSearch }: SubmissionsListHeaderProps) {
    const classes = useStyles();

    const [search, setSearch] = useState('');

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
        <Grid component={'header'} container className={classes.root}>
            <Grid container alignItems={'center'} className={classes.header}>
                <Grid item container xs alignItems={'center'}>
                    <Typography variant={'h4'} className={font.fontWeightBold}>
                        Submissions
                    </Typography>
                    <TextField
                        variant={'outlined'}
                        onChange={handleSearch}
                        value={search}
                        placeholder={'Search...'}
                        className={classes.searchField}
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
                <Grid container item xs justifyContent={'flex-end'}>
                    <Tooltip title={'Coming Soon'}>
                        <span>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                startIcon={<Icon>qr_code_scanner</Icon>}
                                className={classes.scanButton}
                                disabled
                            >
                                Scan Barcode
                            </Button>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
            <TabList indicatorColor={'primary'} textColor={'primary'}>
                <Tab component={Link} to={'/submissions/all/list'} value={'all'} label="All" />
                <Tab component={Link} to={'/submissions/pending/list'} value={'pending'} label="Pending" />
                <Tab component={Link} to={'/submissions/reviewed/list'} value={'reviewed'} label="Reviewed" />
                <Tab component={Link} to={'/submissions/graded/list'} value={'graded'} label="Graded" />
                <Tab component={Link} to={'/submissions/assembled/list'} value={'assembled'} label="Assembled" />
                <Tab component={Link} to={'/submissions/shipped/list'} value={'shipped'} label="Shipped" />
            </TabList>
        </Grid>
    );
}

export default SubmissionsListHeader;
