import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { useAppDispatch } from '@salesrep/redux/hooks';
import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { cx } from '@shared/lib/utils/cx';
import { setCardsSearchValue } from '@shared/redux/slices/salesRepCreateOrderSlice';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    searchInput: {
        width: '100%',
        marginTop: '12px',
    },
    searchInputMobile: {
        marginRight: '0.75em',
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 10,
        paddingBottom: '0.5em',
    },
    searchLabelContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
}));

function AlgoliaSearchWrapper(props: any) {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    function handleSearch(e: any) {
        dispatch(setCardsSearchValue(e.currentTarget.value));
        props.refine(e.currentTarget.value);
    }

    function handleClearSearch() {
        dispatch(setCardsSearchValue(''));
        props.refine('');
    }

    (window as any).globalThis.clearSearch = () => {
        handleClearSearch();
    };

    return (
        <div className={classes.container}>
            <TextField
                size="small"
                className={cx(classes.searchInput)}
                value={props.currentRefinement}
                placeholder={'Search for cards to add...'}
                onChange={(e) => handleSearch(e)}
                variant="outlined"
                InputProps={{
                    ...{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon htmlColor={'#757575'} />
                            </InputAdornment>
                        ),
                    },
                    endAdornment:
                        props.currentRefinement !== '' ? (
                            <InputAdornment position="end">
                                <IconButton aria-label="clear" onClick={handleClearSearch} size="large">
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                }}
            />
        </div>
    );
}
const CustomSearchBox = connectSearchBox(AlgoliaSearchWrapper);

export function CardSubmissionSearchField() {
    const classes = useStyles();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    return (
        <div>
            {!isMobile ? (
                <div className={classes.searchLabelContainer}>
                    <Typography variant={'subtitle2'} className={classes.label}>
                        Search
                    </Typography>
                </div>
            ) : null}
            <CustomSearchBox />
        </div>
    );
}

export default CardSubmissionSearchField;
