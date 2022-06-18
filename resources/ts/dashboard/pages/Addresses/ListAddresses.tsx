import HomeTwoTone from '@mui/icons-material/HomeTwoTone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useEffect, useState } from 'react';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';
import { ListHeader } from '../../components/ListHeader/ListHeader';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    getSavedAddresses,
    setDisableAllShippingInputs,
    setUseCustomShippingAddress,
} from '../../redux/slices/newSubmissionSlice';
import { AddAddressDialog } from './AddAddressDialog';
import { Address } from './Address';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            flexDirection: 'row',
            alignItems: 'center',
            border: '1px solid red',
            marginBottom: '12px',
            borderRadius: '4px',
            padding: '10px 8px 10px 6px',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        leftSide: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '100%',
        },
        rightSide: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        levelTitle: {
            fontFamily: 'Roboto',
            transform: 'translateZ(0)',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        protectionText: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'right',
            letterSpacing: '0.1px',
        },
        expDate: {
            fontWeight: 'normal',
            color: 'black',
        },
        row: {
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        test: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
    }),
    { name: 'PaymentCardItem' },
);

const StyledBox = styled(Box)(
    {
        width: '100%',
        backgroundColor: '#F9F9F9',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '40px 20px',
    },
    { name: 'StyledBox' },
);

export function ListAddresses() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const apiService = useInjectable(APIService);

    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const existingAddresses = useAppSelector((state) => state.newSubmission.step03Data.existingAddresses);

    const handleAddressDeleteSubmit = async (id: string) => {
        console.log(id);
        const endpoint = apiService.createEndpoint(`customer/addresses/${id}`);
        await endpoint.delete('');
    };

    const loadAddresses = () => {};

    useEffect(
        () => {
            (async () => {
                handleUseCustomShippingAddress();
                await dispatch(getSavedAddresses());
            })();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    function handleUseCustomShippingAddress() {
        dispatch(setUseCustomShippingAddress(true));
        dispatch(setDisableAllShippingInputs(false));
    }

    const $newAddress = (
        <Button variant={'contained'} color={'primary'} onClick={() => setShowAddAddressModal(true)}>
            Add Address
        </Button>
    );

    return (
        <>
            <ListHeader headline={'Address Book'} noSearch>
                {$newAddress}
            </ListHeader>
            {existingAddresses.length > 0 ? (
                <>
                    <Typography variant={'caption'} color={'rgba(0, 0, 0, 0.54)'}>
                        OTHER ADDRESSES
                    </Typography>
                    <Box marginBottom={'16px'} />
                    <div className={classes.test}>
                        {existingAddresses?.map((address: any) => (
                            <Address
                                key={address.id}
                                firstName={address.firstName}
                                lastName={address.lastName}
                                address={address.address}
                                flat={address.flat ?? ''}
                                city={address.city}
                                country={address.country.name}
                                state={address.state?.code}
                                id={address.id}
                                zip={address.zipCode}
                                phoneNumber={address.phoneNumber}
                                handleAddressDeleteSubmit={handleAddressDeleteSubmit}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <StyledBox>
                    <Grid container alignItems={'center'} justifyContent={'center'} rowSpacing={1}>
                        <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                            <HomeTwoTone />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={'subtitle1'} fontWeight={500} textAlign={'center'} fontSize={16}>
                                No Saved Addresses
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                                Click Add Address to add an
                                <br />
                                address to your list.
                            </Typography>
                        </Grid>
                    </Grid>
                </StyledBox>
            )}
            <AddAddressDialog
                open={showAddAddressModal}
                onClose={() => setShowAddAddressModal(false)}
                onSubmit={() => loadAddresses()}
            />
        </>
    );
}
