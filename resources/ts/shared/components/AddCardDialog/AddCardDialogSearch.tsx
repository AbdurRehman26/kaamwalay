import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import React, { useCallback, useEffect, useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { useIsMounted } from '@shared/hooks/useIsMounted';
import { font } from '@shared/styles/utils';

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AddCardDialogSearch
 * @date: 13.09.2021
 * @time: 23:40
 */
export const AddCardDialogSearch = connectSearchBox(({ refine }) => {
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

    useEffect(() => {
        if (isMounted()) {
            refine(search);
        }
    }, [isMounted, refine, search]);

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

export default AddCardDialogSearch;
