import ArrowBack from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFormikContext } from 'formik';
import React, { forwardRef, useCallback, useState } from 'react';
import InternationalPhoneNumberField from '@shared/components/InternationalPhoneNumberField';
import theme from '@shared/styles/theme';
import { useAppSelector } from '@dashboard/redux/hooks';

interface Props {
    canGoBack: boolean;
}

const StackDiv = styled(Stack)({
    '.methodDescription': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.1px',
        marginBottom: '4px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.fieldContainer': {
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
    },
    '.inputsRow01': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    '.inputsRow02': {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    '.inputsRow03': {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    '.inputsRow04': {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    '.addressFieldContainer': {
        width: '80%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    '.cityFieldContainer': {
        width: '30%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    '.stateFieldContainer': {
        width: '32%',
        marginTop: '6px',
        [theme.breakpoints.down('sm')]: {
            width: '47%',
        },
    },
    '.zipFieldContainer': {
        width: '32%',
        [theme.breakpoints.down('sm')]: {
            width: '47%',
        },
    },
});

export const NewAddressForm = forwardRef<unknown, Props>(function NewAddressForm({ canGoBack }, ref) {
    const formik = useFormikContext<Record<string, any>>();
    const country = useAppSelector((state) => state.newAddressSlice?.customerAddress.country);
    const availableCountries = useAppSelector((state) => state.newAddressSlice.availableCountriesList);
    const availableStates = useAppSelector((state) => state.newAddressSlice?.availableStatesList);
    const [countryId, setCountryId] = useState<number>(0);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const handleBack = useCallback(() => {
        if (canGoBack) {
            formik.setFieldValue('newAddress', false);
            formik.setFieldValue('address', formik.values.backup);
        }
    }, [canGoBack, formik]);

    return (
        <StackDiv ref={ref}>
            <Grid container alignItems={'center'}>
                {canGoBack ? (
                    <IconButton onClick={handleBack}>
                        <ArrowBack />
                    </IconButton>
                ) : null}
                <Typography variant={'subtitle1'} fontWeight={500} ml={1}>
                    New Shipping Address
                </Typography>
            </Grid>
            <div className={'fieldContainer'} style={{ width: '100%' }}>
                <Typography className={'methodDescription'}>Country</Typography>
                <Select
                    fullWidth
                    native
                    key={country?.id ? country?.id : availableCountries[0]?.id}
                    onChange={(e) => {
                        formik.handleChange(e);
                        setCountryId(Number(e.target.value));
                    }}
                    placeholder={'Select Country'}
                    name={'address.countryId'}
                    variant={'outlined'}
                    style={{ height: '43px', marginTop: 6 }}
                >
                    <option value="none">Select a country</option>
                    {availableCountries.map((item: any) => (
                        <option key={item.id} value={item.id}>
                            {item?.name}
                        </option>
                    ))}
                </Select>
            </div>
            <div className={'inputsRow02'}>
                <div className={'fieldContainer'} style={{ width: '100%' }}>
                    <Typography className={'methodDescription'}>Full Name</Typography>
                    <TextField
                        style={{ margin: 8, marginLeft: 0 }}
                        placeholder="Enter Full Name"
                        name={'address.fullName'}
                        onChange={formik.handleChange}
                        fullWidth
                        size={'small'}
                        variant={'outlined'}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
            <div className={'inputsRow02'}>
                <div className={`${'fieldContainer'} ${'addressFieldContainer'}`} style={{ width: '100%' }}>
                    <Typography className={'methodDescription'}>Address Line #1</Typography>
                    <TextField
                        style={{ margin: 8, marginLeft: 0 }}
                        placeholder="Enter Street Address"
                        fullWidth
                        name={'address.address'}
                        onChange={formik.handleChange}
                        size={'small'}
                        variant={'outlined'}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
            <div className={'inputsRow02'}>
                <div className={`${'fieldContainer'} ${'addressFieldContainer'}`} style={{ width: '100%' }}>
                    <Typography className={'methodDescription'}>Address Line #2 (Optional)</Typography>
                    <TextField
                        style={{ margin: 8, marginLeft: 0 }}
                        placeholder="Enter apt, suite, building, floor etc."
                        fullWidth
                        name={'address.address2'}
                        onChange={formik.handleChange}
                        size={'small'}
                        variant={'outlined'}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
            {isMobile ? (
                <div className={'inputsRow03'}>
                    <div className={`${'fieldContainer'} ${'cityFieldContainer'}`}>
                        <Typography className={'methodDescription'}>City</Typography>
                        <TextField
                            style={{ margin: 8, marginLeft: 0 }}
                            onChange={formik.handleChange}
                            name={'address.city'}
                            placeholder="Enter City"
                            fullWidth
                            size={'small'}
                            variant={'outlined'}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                </div>
            ) : null}
            <div className={'inputsRow03'}>
                {!isMobile ? (
                    <div className={` ${'cityFieldContainer'} ${'fieldContainer'}`}>
                        <Typography className={'methodDescription'}>City</Typography>
                        <TextField
                            style={{ margin: 8, marginLeft: 0 }}
                            onChange={formik.handleChange}
                            name={'address.city'}
                            placeholder="Enter City"
                            fullWidth
                            size={'small'}
                            variant={'outlined'}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                ) : null}

                <div className={`${'fieldContainer'} ${'stateFieldContainer'}`}>
                    <Typography className={'methodDescription'}>State</Typography>
                    {countryId === 1 || !countryId ? (
                        <Select
                            fullWidth
                            native
                            onChange={formik.handleChange}
                            placeholder={'Select State'}
                            variant={'outlined'}
                            style={{ height: '43px' }}
                            name={'address.state'}
                        >
                            <option value="none">Select a state</option>
                            {availableStates.map((item: any) => (
                                <option key={item.id} value={item.name}>
                                    {item?.code}
                                </option>
                            ))}
                        </Select>
                    ) : (
                        <TextField
                            style={{ marginTop: 2 }}
                            placeholder="Enter State"
                            fullWidth
                            onChange={formik.handleChange}
                            name={'address.state'}
                            size={'small'}
                            variant={'outlined'}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                </div>
                <div className={`${'fieldContainer'} ${'zipFieldContainer'}`}>
                    <Typography className={'methodDescription'}>Zip Code</Typography>
                    <TextField
                        style={{ margin: 8, marginLeft: 0 }}
                        placeholder="Enter Zip Code"
                        fullWidth
                        onChange={formik.handleChange}
                        name={'address.zip'}
                        onBlur={formik.handleBlur}
                        size={'small'}
                        variant={'outlined'}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
            <div className={'inputsRow04'}>
                <div className={'fieldContainer'} style={{ width: '100%', marginTop: '4px' }}>
                    <Typography className={'methodDescription'}>Phone Number</Typography>
                    <InternationalPhoneNumberField
                        onChange={(value, data, event, formattedValue) => {
                            formik.handleChange(event);
                        }}
                        dropdownStyle={{
                            position: 'fixed',
                        }}
                        inputProps={{
                            name: 'address.phone',
                        }}
                    />
                </div>
            </div>
        </StackDiv>
    );
});
