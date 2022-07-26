import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Grid, { GridProps } from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { CustomerAddDialog } from '@admin/components/Customer/CustomerAddDialog';

interface Props extends GridProps {
    title: string;
    searchField?: boolean;
    value?: string;
    onSearch?: (search: string) => void;
}

const Root = styled(Grid)(() => ({
    backgroundColor: '#f9f9f9',
    width: '100%',
    borderBottom: '1px solid #e0e0e0',
    '.ListPageHeader-search': {
        '.MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            borderRadius: 24,
            minWidth: 380,
            paddingRight: 4,
        },
        '.MuiOutlinedInput-input': {
            padding: '12.5px 14px 12.5px 0',
        },
    },
}));

const useStyles = makeStyles(
    (theme) => ({
        newCustomerBtn: {
            borderRadius: 24,
            padding: '12px 24px',
            [theme.breakpoints.down('sm')]: {
                marginLeft: 'auto',
                padding: '9px 16px',
            },
        },
    }),
    {
        name: 'ListPageHeader',
    },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ListPageHeader
 * @date: 23.12.2021
 * @time: 21:44
 */
export function ListPageHeader({ title, searchField, value, onSearch, children, ...rest }: Props) {
    const classes = useStyles();
    const [search, setSearch] = useState(value ?? '');
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);

    const handleSearchValue = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []);

    const handleSearch = useCallback(() => {
        setTimeout(() => {
            if (onSearch) {
                onSearch(search);
            }
        }, 300);
    }, [onSearch, search]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            e.key === 'Enter' && handleSearch();
        },
        [handleSearch],
    );

    useEffect(() => {
        setSearch(value ?? '');
    }, [value]);

    return (
        <Root pt={3} pb={3} pl={2.5} pr={2.5} {...rest}>
            <CustomerAddDialog open={addCustomerDialog} onClose={() => setAddCustomerDialog(!addCustomerDialog)} />
            <Grid container justifyContent={'space-between'}>
                <Grid display={'flex'} alignItems={'center'} item>
                    <Typography variant={'h4'} fontWeight={500} mr={3}>
                        {title}
                    </Typography>
                    {searchField && (
                        <TextField
                            className={'ListPageHeader-search'}
                            value={search}
                            onChange={handleSearchValue}
                            onKeyDown={handleKeyDown}
                            placeholder={'Search...'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position={'start'}>
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment:
                                    search || search === '' ? (
                                        <InputAdornment position={'end'}>
                                            <IconButton onClick={handleSearch}>
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                            }}
                        />
                    )}
                </Grid>
                <Grid item>
                    <Button
                        onClick={() => setAddCustomerDialog(true)}
                        variant={'contained'}
                        color={'primary'}
                        className={classes.newCustomerBtn}
                    >
                        Add Customer
                    </Button>
                </Grid>
            </Grid>
            {children}
        </Root>
    );
}
