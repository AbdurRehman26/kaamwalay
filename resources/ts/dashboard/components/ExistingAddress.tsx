import { Paper } from '@material-ui/core';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setSelectedExistingAddress, setUseCustomShippingAddress } from '@dashboard/redux/slices/newSubmissionSlice';

type ExistingAddressProps = {
    firstName: string;
    lastName: string;
    address: string;
    flat: string;
    zip: string;
    city: string;
    country: string;
    id: number;
};

const useStyles = makeStyles(
    {
        container: {
            width: 'auto',
            padding: '12px',
            paddingTop: '7px',
            display: 'flex',
            flexDirection: 'column',
            borderStyle: 'solid',
            borderWidth: ({ isSelected }: any) => (isSelected ? '3px' : '1px'),
            borderColor: ({ isSelected }: any) => (isSelected ? '#20BFB8' : '#DDDDDD'),
            '&:hover': {
                cursor: 'pointer',
            },
            marginRight: '12px',
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
        },
    },
    { name: 'ExistingAddressComponent' },
);

function ExistingAddress(props: ExistingAddressProps) {
    const selectedExistingAddressID = useAppSelector(
        (state) => state.newSubmission.step03Data.selectedExistingAddress.id,
    );
    const dispatch = useAppDispatch();
    const { firstName, lastName, address, flat, zip, city, country, id } = props;
    const classes = useStyles({ isSelected: selectedExistingAddressID === id });

    function handleRadioPress() {
        dispatch(setSelectedExistingAddress(id));

        // We disable the custom shipping checkbox when he presses on an existing address
        // As a side effect of this, all the inputs will get disabled too
        // This will protect us from the scenario of having the user complete both the text fields and also select an address
        // And, since this component is only rendered if the user has multiple saved addresses, it won't affect the first time user
        dispatch(setUseCustomShippingAddress(false));
    }

    return (
        <Paper variant={'outlined'} className={classes.container} onClick={handleRadioPress}>
            <div className={classes.radioBtnContainer}>
                <Radio color={'primary'} onClick={handleRadioPress} checked={selectedExistingAddressID === id} />
            </div>
            <Typography className={classes.addressLineText}>{`${firstName} ${lastName}`}</Typography>
            <Typography className={classes.addressLineText}>{`${address} ${
                flat.length !== 0 ? `Apt: ${flat}` : ''
            }`}</Typography>
            <Typography className={classes.addressLineText}>{`${city}, ${country} ${zip}, US`}</Typography>
        </Paper>
    );
}

export default ExistingAddress;
