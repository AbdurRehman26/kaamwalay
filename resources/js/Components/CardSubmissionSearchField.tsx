import React from 'react';
import Typography from "@material-ui/core/Typography";
import {IconButton, InputAdornment, makeStyles, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import {useAppDispatch, useAppSelector} from "../hooks";
import {setCardsSearchValue} from "../Redux/Slices/newSubmissionSlice";


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
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "24px",
        letterSpacing: "0.1px",
        color: "rgba(0, 0, 0, 0.87)"
    },
});

function CardSubmissionSearchField() {

    const classes = useStyles();

    const dispatch = useAppDispatch();
    const searchValue = useAppSelector(state => state.newSubmission.step02Data.searchValue);

    function handleSearchChange(searchValue: any) {
        dispatch(setCardsSearchValue(searchValue));
    }

    function handleClearSearch() {
        dispatch(setCardsSearchValue(''));
    }
    return (
        <div className={classes.searchContainer}>
            <Typography variant={'subtitle2'} className={classes.label}> Search </Typography>
            <TextField
                size="small"
                className={classes.searchInput}
                value={searchValue}
                placeholder={'Search for a card...'}
                onChange={e => handleSearchChange(e.target.value)}
                variant="outlined" InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon htmlColor={'#757575'}/>
                    </InputAdornment>
                ),
                endAdornment: ( searchValue !== '' ?
                    <InputAdornment position="end">
                        <IconButton aria-label="clear" onClick={handleClearSearch}>
                            <CloseIcon/>
                        </IconButton>
                    </InputAdornment> : null
                )
            }}/>
        </div>
    )
}

export default CardSubmissionSearchField;
