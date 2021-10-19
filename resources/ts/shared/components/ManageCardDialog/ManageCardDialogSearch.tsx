import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { useIsMounted } from '@shared/hooks/useIsMounted';
import { font } from '@shared/styles/utils';

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialogSearch
 * @date: 13.09.2021
 * @time: 23:40
 */
export const ManageCardDialogSearch = connectSearchBox(({ refine, isSearchStalled }) => {
    const isMounted = useIsMounted();
    const [search, setSearch] = useState('');

    const handleSearch = useCallback(
        (e) => {
            setSearch(e.target.value);
        },
        [setSearch],
    );

    const handleClear = useCallback(() => {
        setSearch('');
    }, [setSearch]);

    useEffect(
        () => {
            if (isMounted()) {
                refine(search);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search],
    );

    return (
        <>
            <Typography variant={'body1'} className={font.fontWeightMedium}>
                Search
            </Typography>
            <TextField
                fullWidth
                variant={'outlined'}
                size={'small'}
                placeholder={'Search for a card ...'}
                value={search}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position={'start'}>
                            <SearchIcon color={'disabled'} />
                        </InputAdornment>
                    ),
                    endAdornment: search ? (
                        <InputAdornment position={'end'}>
                            <IconButton onClick={handleClear} size={'small'}>
                                <CloseIcon />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }}
            />
        </>
    );
});

export default ManageCardDialogSearch;
