import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setCardsSearchValue, setIsMobileSearchModalOpen } from '../redux/slices/newSubmissionSlice';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    searchInput: {
        width: '100%',
        marginTop: '6px',
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'column',
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
});

function AlogliaSearchWrapper(props: any) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const searchValue = useAppSelector((state) => state.newSubmission.step02Data.searchValue);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const isMobileSearchModalOpen = useAppSelector((state) => state.newSubmission.step02Data.isMobileSearchModalOpen);

    function handleClearSearch() {
        dispatch(setCardsSearchValue(''));
        props.refine('');
    }

    function handleSearch(e: any) {
        dispatch(setCardsSearchValue(e.currentTarget.value));
        props.refine(e.currentTarget.value);
        if (isMobile && !isMobileSearchModalOpen) {
            dispatch(setIsMobileSearchModalOpen(true));
        }
    }

    function handleClick() {
        if (searchValue === '' && isMobile) {
            dispatch(setIsMobileSearchModalOpen(true));
        }
    }

    return (
        <div className={classes.container}>
            <TextField
                size="small"
                className={classes.searchInput}
                value={props.currentRefinement}
                placeholder={'Search for a card...'}
                onChange={(e) => handleSearch(e)}
                onClick={handleClick}
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
const CustomSearchBox = connectSearchBox(AlogliaSearchWrapper);

function CardSubmissionSearchField() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const isMobileSearchModalOpen = useAppSelector((state) => state.newSubmission.step02Data.isMobileSearchModalOpen);

    function handleCloseIconPress() {
        dispatch(setCardsSearchValue(''));
        dispatch(setIsMobileSearchModalOpen(false));
    }

    return (
        <div className={classes.searchContainer}>
            <div className={classes.searchLabelContainer}>
                <Typography variant={'subtitle2'} className={classes.label}>
                    Search
                </Typography>
                {isMobile && isMobileSearchModalOpen ? (
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseIconPress}
                        aria-label="close"
                        size="large"
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </div>
            <CustomSearchBox />
        </div>
    );
}

export default CardSubmissionSearchField;
