import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch } from 'react-redux';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';

const useStyles = makeStyles({
    cleaningFeeContainer: {
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        padding: '16px',
    },
    cleaningText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'left',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
});

interface props {
    requiresCleaning: any;
    setRequiresCleaning: any;
}

export function CleaningFee({ requiresCleaning, setRequiresCleaning }: props) {
    const classes = useStyles();
    const { featureOrderCleaningFeePerCard, featureOrderCleaningFeeMaxCap } = useConfiguration();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const dispatch = useDispatch();

    function setShippingFee() {
        dispatch(setRequiresCleaning);
    }

    return (
        <div className={classes.cleaningFeeContainer}>
            <Box display={'flex'} alignItems={'center'} pb={1}>
                <Typography fontWeight={500}>Card Cleaning Service</Typography>
            </Box>
            <Box display={'flex'}>
                <Typography className={classes.cleaningText} variant={'subtitle1'}>
                    Would you like to have the card(s) in this submission cleaned?
                </Typography>
            </Box>
            <FormControlLabel
                sx={{ marginTop: '10px', alignItems: isMobile ? 'start' : 'center' }}
                control={<Checkbox color={'primary'} onChange={setShippingFee} checked={requiresCleaning} />}
                label={
                    <Box display={'flex'} alignItems={'center'}>
                        <Typography sx={{ marginTop: isMobile ? '6px' : '0px' }}>
                            Yes, clean these cards for an additional {formatCurrency(featureOrderCleaningFeePerCard)}{' '}
                            per card.
                            <span className={classes.cleaningText}>
                                {'  '} (Up to {formatCurrency(featureOrderCleaningFeeMaxCap)})
                            </span>
                        </Typography>
                    </Box>
                }
            />
        </div>
    );
}

export default CleaningFee;
