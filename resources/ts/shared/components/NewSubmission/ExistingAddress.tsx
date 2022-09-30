import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import {
    getShippingFee,
    setSelectedExistingAddress,
    setUseCustomShippingAddress,
} from '@shared/redux/slices/adminCreateOrderSlice';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';

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
            width: '100%',
            padding: '12px',
            paddingTop: '7px',
            borderRadius: '2px',
            display: 'flex',
            flexDirection: 'row',
            borderStyle: 'solid',
            borderWidth: ({ isSelected }: any) => (isSelected ? '3px' : '1px'),
            borderColor: ({ isSelected }: any) => (isSelected ? '#20BFB8' : '#DDDDDD'),
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
            width: 'auto',
            height: '25px',
            justifyContent: 'flex-start',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
    }),
    { name: 'ExistingAddressComponent' },
);

function ExistingAddress(props: ExistingAddressProps) {
    const selectedExistingAddressID = useAppSelector(
        (state) => state.adminCreateOrderSlice.step03Data.selectedExistingAddress.id,
    );
    const selectedCards = useAppSelector((state) => state.adminCreateOrderSlice.step02Data.selectedCards);

    const dispatch = useAppDispatch();
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const { fullName, address, address2, zip, city, state, country, id } = props;
    const classes = useStyles({ isSelected: selectedExistingAddressID === id });

    async function handleRadioPress() {
        // We disable the custom shipping checkbox when he presses on an existing address
        // As a side effect of this, all the inputs will get disabled too
        // This will protect us from the scenario of having the user complete both the text fields and also select an address
        // And, since this component is only rendered if the user has multiple saved addresses, it won't affect the first time user
        dispatch(setUseCustomShippingAddress(false));
        dispatch(setSelectedExistingAddress(id));
        setIsLoadingAddresses(true);
        if (selectedCards.length > 0) {
            await dispatch(getShippingFee(selectedCards));
        }
        setIsLoadingAddresses(false);
    }

    return (
        <>
            {isLoadingAddresses ? (
                <Grid container alignItems={'center'} justifyContent={'center'} p={3}>
                    <CircularProgress />
                </Grid>
            ) : (
                <Grid display={'flex'} md={6}>
                    <Grid className={classes.container} ml={1.5} mr={1.5} onClick={handleRadioPress}>
                        <div className={classes.radioBtnContainer}>
                            <Radio
                                color={'primary'}
                                onClick={handleRadioPress}
                                checked={selectedExistingAddressID === id}
                            />
                        </div>
                        <div>
                            <Typography className={classes.addressLineText}>{`${fullName}`}</Typography>
                            <Typography className={classes.addressLineText}>{`${address} ${address2}`}</Typography>
                            <Typography
                                className={classes.addressLineText}
                            >{`${city}, ${state} ${zip}, ${country}`}</Typography>
                            <Typography className={classes.addressLineText}>{` ${zip}, ${country}`}</Typography>
                        </div>
                    </Grid>
                </Grid>
            )}
        </>
    );
}

export default ExistingAddress;
