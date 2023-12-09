import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setRequiresSignature, setSignatureFee } from '@dashboard/redux/slices/newSubmissionSlice';

const useStyles = makeStyles(
    (theme) => ({
        signatureFeeContainer: {
            paddingTop: '24px',
            paddingBottom: '36px',
        },
        signatureTitle: {
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '24px',
            letterSpacing: '0.1px',
        },
        signatureText: {
            fontFamily: 'Roboto',
            fontSize: '12px',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        signatureCheckboxText: {
            fontFamily: 'Roboto',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
    }),
    { name: 'SignatureAtDelivery' },
);
export function SignatureAtDelivery() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const requiresSignature = useAppSelector((state) => state.newSubmission.step03Data.requiresSignature);

    const { featureOrderSignatureAtDeliveryFeeValue } = useConfiguration();

    function setRequiresSignatureFee() {
        dispatch(setRequiresSignature(!requiresSignature));
    }

    useEffect(() => {
        dispatch(setSignatureFee(requiresSignature ? featureOrderSignatureAtDeliveryFeeValue : 0));
    }, [dispatch, featureOrderSignatureAtDeliveryFeeValue, requiresSignature]);

    return (
        <Grid container display={'flex'} flexDirection={'column'} mb={3}>
            <div className={classes.signatureFeeContainer}>
                <Box display={'flex'} alignItems={'center'}>
                    <Typography className={classes.signatureTitle}>Require Signature at Delivery?</Typography>
                </Box>
                <Box display={'flex'}>
                    <Typography className={classes.signatureText} variant={'subtitle1'}>
                        Would you like to make signature required at delivery for an extra charge of{' '}
                        {formatCurrency(featureOrderSignatureAtDeliveryFeeValue)}?
                    </Typography>
                </Box>
                <FormControlLabel
                    sx={{ marginTop: '10px', alignItems: isMobile ? 'start' : 'center' }}
                    control={
                        <Checkbox color={'primary'} onChange={setRequiresSignatureFee} checked={requiresSignature} />
                    }
                    label={
                        <Box display={'flex'} alignItems={'center'}>
                            <Typography
                                className={classes.signatureCheckboxText}
                                sx={{ marginTop: isMobile ? '6px' : '0px' }}
                            >
                                Require Signature at Delivery for{' '}
                                {formatCurrency(featureOrderSignatureAtDeliveryFeeValue)}.
                            </Typography>
                        </Box>
                    }
                />
            </div>
            <Divider />
        </Grid>
    );
}
