import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid, { GridProps } from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useNotifications } from '@shared/hooks/useNotifications';
import { getAllCards } from '@shared/redux/slices/adminCardsSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import { CardAddDialog } from './CardAddDialog';

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
        name: 'CardPageHeader',
    },
);

export function CardPageHeader({ title, searchField, value, onSearch, children, ...rest }: Props) {
    const classes = useStyles();
    const [search, setSearch] = useState(value ?? '');
    const [addCardDialog, setAddCardDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const notifications = useNotifications();

    const debouncedFunc = debounce((func: any) => {
        func();
    }, 300);

    const handleSearch = useCallback(
        (e) => {
            setSearch(e.target.value);
            if (onSearch) {
                debouncedFunc(() => {
                    onSearch(e.target.value);
                });
            }
        },
        [setSearch, onSearch, debouncedFunc],
    );

    const handleAddSubmit = async () => {
        try {
            setIsLoading(true);
            setAddCardDialog(false);
            await dispatch(getAllCards);
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
                    <CardAddDialog
                        onSubmit={handleAddSubmit}
                        open={addCardDialog}
                        onClose={() => setAddCardDialog(false)}
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
                                    onChange={handleSearch}
                                    placeholder={'Search...'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position={'start'}>
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        </Grid>
                        <Grid item>
                            <Button
                                onClick={() => setAddCardDialog(true)}
                                variant={'contained'}
                                color={'primary'}
                                className={classes.newCustomerBtn}
                            >
                                Create Card
                            </Button>
                        </Grid>
                    </Grid>
                    {children}
                </>
            )}
        </Root>
    );
}
