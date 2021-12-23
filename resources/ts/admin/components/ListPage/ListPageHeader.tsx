import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import { useCallback, useState, ChangeEvent, KeyboardEvent } from 'react';
import IconButton from '@mui/material/IconButton';

interface Props {
    title: string;
    searchField?: boolean;
    onSearch?: (search: string) => void;
}

const Root = styled('header')(({ theme }) => ({
    backgroundColor: '#f9f9f9',
    padding: theme.spacing(3, 2.5),
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

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ListPageHeader
 * @date: 23.12.2021
 * @time: 21:44
 */
export function ListPageHeader({ title, searchField, onSearch }: Props) {
    const [search, setSearch] = useState('');

    const handleSearchValue = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []);
    const handleSearch = useCallback(() => onSearch && onSearch(search), [onSearch, search]);
    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            e.key === 'Enter' && handleSearch();
        },
        [handleSearch],
    );

    return (
        <Root>
            <Grid container alignItems={'center'}>
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
                            endAdornment: search ? (
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
        </Root>
    );
}
