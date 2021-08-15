import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { useAppDispatch } from '../redux/hooks';
import { setCardsSearchValue } from '../redux/slices/newSubmissionSlice';

const useStyles = makeStyles({
    searchInput: {
        width: '100%',
        marginTop: '6px',
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'column',
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
});

function AlogliaSearchWrapper(props: any) {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    function handleClearSearch() {
        dispatch(setCardsSearchValue(''));
        props.refine('');
    }

    function handleSearch(e: any) {
        dispatch(setCardsSearchValue(e.currentTarget.value));
        props.refine(e.currentTarget.value);
    }

    return (
        <TextField
            size="small"
            className={classes.searchInput}
            value={props.currentRefinement}
            placeholder={'Search for a card...'}
            onChange={(e) => handleSearch(e)}
            variant="outlined"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon htmlColor={'#757575'} />
                    </InputAdornment>
                ),
                endAdornment:
                    props.currentRefinement !== '' ? (
                        <InputAdornment position="end">
                            <IconButton aria-label="clear" onClick={handleClearSearch}>
                                <CloseIcon />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
            }}
        />
    );
}
const CustomSearchBox = connectSearchBox(AlogliaSearchWrapper);

function CardSubmissionSearchField() {
    const classes = useStyles();
    return (
        <div className={classes.searchContainer}>
            <Typography variant={'subtitle2'} className={classes.label}>
                Search
            </Typography>
            <CustomSearchBox />
        </div>
    );
}

export default CardSubmissionSearchField;
