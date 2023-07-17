import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '@salesrep/redux/hooks';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { setHasShippingInsurance, setShippingInsuranceFee } from '@shared/redux/slices/salesRepCreateOrderSlice';

export function ShippingInsurance() {
    const hasShippingInsurance = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.step03Data.hasShippingInsurance,
    );
    const selectedCards = useAppSelector((state) => state.salesRepCreateOrderSlice.step02Data.selectedCards);
    const dispatch = useAppDispatch();
    const [fullShippingInsuranceDisplay, setFullShippingInsuranceDisplay] = useState(0);
    const { featureOrderInsuranceShippingFeePercentage } = useConfiguration();

    useEffect(() => {
        const totalDeclaredValue = selectedCards.reduce(
            (prev, curr) => prev + (curr?.qty ?? 0) * (curr?.value ?? 0),
            0,
        );
        setFullShippingInsuranceDisplay((totalDeclaredValue * featureOrderInsuranceShippingFeePercentage) / 100);
    }, [featureOrderInsuranceShippingFeePercentage, selectedCards]);

    useEffect(() => {
        if (hasShippingInsurance) {
            dispatch(setShippingInsuranceFee(fullShippingInsuranceDisplay));
        } else {
            dispatch(setShippingInsuranceFee(0));
        }
    }, [dispatch, fullShippingInsuranceDisplay, hasShippingInsurance]);

    const updateHasShippingInsurance = (selected: boolean) => {
        dispatch(setHasShippingInsurance(selected));
    };

    return (
        <Grid container display={'flex'} flexDirection={'column'} mb={3} px={3}>
            <Divider />

            <Typography variant={'subtitle1'} fontWeight={500} mr={1} pt={3}>
                Shipping Insurance
            </Typography>
            <Grid
                mb={'24px'}
                item
                container
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                spacing={2}
            >
                <Grid item sm={6}>
                    <OptionButton
                        onClick={() => updateHasShippingInsurance(true)}
                        className={hasShippingInsurance ? 'selected' : ''}
                    >
                        <Radio className={'radioButton'} checked={hasShippingInsurance} />
                        <Grid item container display={'flex'} flexDirection={'row'}>
                            <Grid item xs={10}>
                                <Typography className={'optionTitle'}>Full Shipping Insurance</Typography>
                            </Grid>
                            <Grid item xs={2} display={'flex'} justifyContent={'flex-end'} pr={1}>
                                <NumberFormat
                                    value={fullShippingInsuranceDisplay}
                                    displayType={'text'}
                                    thousandSeparator
                                    decimalSeparator={'.'}
                                    prefix={'$'}
                                    className={'value'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </Grid>
                        </Grid>
                    </OptionButton>
                </Grid>
                <Grid item sm={6}>
                    <OptionButton
                        onClick={() => updateHasShippingInsurance(false)}
                        className={!hasShippingInsurance ? 'selected' : ''}
                    >
                        <Radio className={'radioButton'} checked={!hasShippingInsurance} />
                        <Grid container display={'flex'} flexDirection={'column'}>
                            <Typography className={'optionTitle'}>No Shipping Insurance</Typography>
                        </Grid>
                    </OptionButton>
                </Grid>
            </Grid>
        </Grid>
    );
}

const OptionButton = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    textAlign: 'start',
    justifyContent: 'flex-start !important',
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 2,
    padding: theme.spacing(1),
    '.MuiSvgIcon-root': {
        color: theme.palette.text.secondary,
    },
    '.value': {
        color: theme.palette.primary.main,
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '20px',
    },
    '.description': {
        color: theme.palette.text.secondary,
    },
    '&.selected': {
        border: '2px solid ' + theme.palette.primary.main,
        '.MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
        '.optionTitle': {
            fontWeight: 500,
        },
    },
}));
