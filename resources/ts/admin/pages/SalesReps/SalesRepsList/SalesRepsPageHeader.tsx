import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid, { GridProps } from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { SelectAndCreateCustomerDialog } from '../../Submissions/CreateSubmission/SelectAndCreateCustomerDialog';

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
    '.SalesRepsPageHeader-search': {
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
        newSalesRepBtn: {
            borderRadius: 24,
            padding: '12px 24px',
            [theme.breakpoints.down('sm')]: {
                marginLeft: 'auto',
                padding: '9px 16px',
            },
        },
    }),
    {
        name: 'SalesRepsPageHeader',
    },
);

export function SalesRepsPageHeader({ title, searchField, value, onSearch, children, ...rest }: Props) {
    const classes = useStyles();
    const [search, setSearch] = useState(value ?? '');
    const [createSubmission, setCreateSubmission] = useState(false);

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

    return (
        <Root pt={3} pb={3} pl={2.5} pr={2.5} {...rest}>
            {false ? (
                <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <SelectAndCreateCustomerDialog
                        btnText={'Create New User'}
                        fromSalesReps={true}
                        onClose={() => setCreateSubmission(false)}
                        open={createSubmission}
                    />
                    <Grid container justifyContent={'space-between'}>
                        <Grid display={'flex'} alignItems={'center'} item>
                            <Typography variant={'h4'} fontWeight={500} mr={3}>
                                {title}
                            </Typography>
                            {searchField && (
                                <TextField
                                    className={'SalesRepsPageHeader-search'}
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
                                onClick={() => setCreateSubmission(true)}
                                variant={'contained'}
                                color={'primary'}
                                className={classes.newSalesRepBtn}
                            >
                                Add Sales Rep
                            </Button>
                        </Grid>
                    </Grid>
                    {children}
                </>
            )}
        </Root>
    );
}
