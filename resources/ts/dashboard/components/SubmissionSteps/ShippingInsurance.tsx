import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setHasShippingInsurance, setShippingInsuranceFee } from '@dashboard/redux/slices/newSubmissionSlice';

const useStyles = makeStyles(
    (theme) => ({
        fullInsuranceListItem: {
            display: 'list-item',
            listStyleType: 'disc',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            padding: 0,
        },
    }),
    { name: 'ShippingInsurance' },
);
export function ShippingInsurance() {
    const hasShippingInsurance = useAppSelector((state) => state.newSubmission.step03Data.hasShippingInsurance);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const dispatch = useAppDispatch();
    const classes = useStyles();
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
        <Grid container display={'flex'} flexDirection={'column'} mb={3}>
            <Grid item container mt={'24px'} mb={'20px'}>
                <Typography variant={'subtitle1'} fontWeight={500} mr={1}>
                    Shipping Insurance
                </Typography>
                <Typography fontSize={14} lineHeight={'20px'}>
                    While the service fee covers any potential loss or damage that may occur while your cards our in our
                    possession, we recommend <b>Full Shipping Insurance</b> to protect your cards while in transit back
                    to you.
                </Typography>
            </Grid>
            <Grid mb={'24px'}>
                <OptionButton
                    onClick={() => updateHasShippingInsurance(true)}
                    className={hasShippingInsurance ? 'selected' : ''}
                >
                    <Radio className={'radioButton'} checked={hasShippingInsurance} />
                    <Grid container display={'flex'} flexDirection={'column'} pt={1}>
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
                        <Grid item pl={2}>
                            <List>
                                <ListItem className={classes.fullInsuranceListItem}>Recommended</ListItem>
                                <ListItem className={classes.fullInsuranceListItem}>
                                    Fee: 1% of total declared value
                                </ListItem>
                                <ListItem className={classes.fullInsuranceListItem}>
                                    Fully covers any loss or damage that might occur to your cards while in transit back
                                    to you, <br />
                                    up to the point of delivery.
                                </ListItem>
                                <ListItem className={classes.fullInsuranceListItem}>
                                    Does not apply to stolen packages (after delivery), or to any shipments you make to
                                    AGS.
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </OptionButton>
                <OptionButton
                    onClick={() => updateHasShippingInsurance(false)}
                    className={!hasShippingInsurance ? 'selected' : ''}
                >
                    <Radio className={'radioButton'} checked={!hasShippingInsurance} />
                    <Grid container display={'flex'} flexDirection={'column'} pt={1}>
                        <Typography className={'optionTitle'}>No Shipping Insurance</Typography>
                    </Grid>
                </OptionButton>
            </Grid>

            <Divider />
        </Grid>
    );
}

const OptionButton = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'start',
    textAlign: 'start',
    justifyContent: 'flex-start !important',
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 2,
    padding: theme.spacing(1),
    marginBottom: '20px',
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
