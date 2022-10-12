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
import { useNotifications } from '@shared/hooks/useNotifications';
import { RaritiesAddDialog } from './RaritiesAddDialog';

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
        name: 'RaritiesPageHeader',
    },
);

export function RaritiesPageHeader({ title, searchField, value, onSearch, children, ...rest }: Props) {
    const classes = useStyles();
    const [search, setSearch] = useState(value ?? '');
    const [addRaritiesDialog, setAddRaritiesDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const notifications = useNotifications();

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

    const handleAddSubmit = async () => {
        try {
            setIsLoading(true);
            setAddRaritiesDialog(false);
            window.location.reload();
            setIsLoading(false);
        } catch (e: any) {
            setIsLoading(false);
            notifications.exception(e);
        }
    };

    return (
        <Root pt={3} pb={3} pl={2.5} pr={2.5} {...rest}>
            {isLoading ? (
                <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <RaritiesAddDialog
                        title={'Add Rarity'}
                        onSubmit={handleAddSubmit}
                        open={addRaritiesDialog}
                        onClose={() => setAddRaritiesDialog(false)}
                    />
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
                                onClick={() => setAddRaritiesDialog(true)}
                                variant={'contained'}
                                color={'primary'}
                                className={classes.newCustomerBtn}
                            >
                                Create Rarity
                            </Button>
                        </Grid>
                    </Grid>
                    {children}
                </>
            )}
        </Root>
    );
}
