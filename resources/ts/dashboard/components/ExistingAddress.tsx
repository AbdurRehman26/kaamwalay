import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import {
    getShippingFee,
    setSelectedExistingAddress,
    setUseCustomShippingAddress,
} from '@dashboard/redux/slices/newSubmissionSlice';

type ExistingAddressProps = {
    fullName: string;
    address: string;
    address2?: string;
    flat?: string;
    zip: string;
    city: string;
    state: string;
    country: string;
    id: number;
};

const useStyles = makeStyles(
    (theme) => ({
        container: {
            width: '200px',
            padding: '12px',
            paddingTop: '7px',
            display: 'flex',
            flexDirection: 'column',
            borderStyle: 'solid',
            borderWidth: ({ isSelected }: any) => (isSelected ? '3px' : '1px'),
            borderColor: ({ isSelected }: any) => (isSelected ? '#20BFB8' : '#DDDDDD'),
            marginRight: '12px',
            marginBottom: '12px',
            '&:hover': {
                cursor: 'pointer',
            },
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        addressLineText: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: ({ isSelected }: any) => (isSelected ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.54)'),
        },
        radioBtnContainer: {
            display: 'flex',
            flexDirection: 'row',
            // Doing this (110%) because the radio btn has some kind of space on the right which doesn't allow me to push it all the way to the right side
            width: '110%',
            height: '25px',
            justifyContent: 'flex-end',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
    }),
    { name: 'ExistingAddressComponent' },
);

function ExistingAddress(props: ExistingAddressProps) {
    const selectedExistingAddressID = useAppSelector(
        (state) => state.newSubmission.step03Data.selectedExistingAddress.id,
    );
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);

    const dispatch = useAppDispatch();
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const { fullName, address, address2, flat, zip, city, state, country, id } = props;
    const classes = useStyles({ isSelected: selectedExistingAddressID === id });

    async function handleRadioPress() {
        dispatch(setSelectedExistingAddress(id));
        setIsLoadingAddresses(true);
        await dispatch(getShippingFee(selectedCards));
        setIsLoadingAddresses(false);
        // We disable the custom shipping checkbox when he presses on an existing address
        // As a side effect of this, all the inputs will get disabled too
        // This will protect us from the scenario of having the user complete both the text fields and also select an address
        // And, since this component is only rendered if the user has multiple saved addresses, it won't affect the first time user
        dispatch(setUseCustomShippingAddress(false));
    }

    return (
        <>
            {isLoadingAddresses ? (
                <Grid container alignItems={'center'} justifyContent={'center'} p={3}>
                    <CircularProgress />
                </Grid>
            ) : (
                <Paper variant={'outlined'} className={classes.container} onClick={handleRadioPress}>
                    <div className={classes.radioBtnContainer}>
                        <Radio
                            color={'primary'}
                            onClick={handleRadioPress}
                            checked={selectedExistingAddressID === id}
                        />
                    </div>
                    <Typography className={classes.addressLineText}>{`${fullName}`}</Typography>
                    <Typography className={classes.addressLineText}>{`${address} ${address2} ${
                        flat ? `Apt: ${flat}` : ''
                    }`}</Typography>
                    <Typography
                        className={classes.addressLineText}
                    >{`${city}, ${state} ${zip}, ${country}`}</Typography>
                </Paper>
            )}
        </>
    );
}

export default ExistingAddress;
