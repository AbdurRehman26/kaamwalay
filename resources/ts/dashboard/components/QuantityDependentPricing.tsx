import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const CardDiv = styled(Grid)({
    border: '2px solid #20BFB8',
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
    marginBottom: '12px',
    borderBottomLeftRadius: '2px',
    borderBottomRightRadius: '2px',
    '.QuantityPricingHeadings': {
        display: 'flex',
        justifyContent: 'space-around',
        background: '#F9F9F9',
        borderBottom: '1px solid #E0E0E0',
    },
    '.QuantityAndPricing': {
        display: 'flex',
        justifyContent: 'space-around',
    },
    '.Quantity': {
        padding: '10px',
        textAlign: 'center',
    },
    '.Pricing': {
        padding: '10px',
        textAlign: 'center',
    },
    '.Heading': {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CardsDiv': {
        width: '100%',
        padding: '20px',
        borderRight: '1px solid #E0E0E0',
    },
    '.PriceDiv': {
        padding: '20px',
        width: '100%',
    },
    '.QuantityDiv': {
        width: '100%',
        borderRight: '1px solid #E0E0E0',
    },
    '.PricingDiv': {
        width: '100%',
    },
});

export const QuantityDependentPricing = () => {
    return (
        <CardDiv>
            <Grid className={'QuantityPricingHeadings'}>
                <div className={'CardsDiv'}>
                    <Typography className={'Heading'}>Cards in Order</Typography>
                </div>
                <div className={'PriceDiv'}>
                    <Typography className={'Heading'}>Price</Typography>
                </div>
            </Grid>
            <Grid className={'QuantityAndPricing'}>
                <div className={'QuantityDiv'}>
                    <Typography className={'Quantity'}>1-20</Typography>
                    <Typography className={'Quantity'}>21-50</Typography>
                    <Typography className={'Quantity'}>51-100</Typography>
                    <Typography className={'Quantity'}>101-200</Typography>
                    <Typography className={'Quantity'}>200+</Typography>
                </div>
                <div className={'PricingDiv'}>
                    <Typography className={'Pricing'}>$18</Typography>
                    <Typography className={'Pricing'}>$17</Typography>
                    <Typography className={'Pricing'}>$16</Typography>
                    <Typography className={'Pricing'}>$15</Typography>
                    <Typography className={'Pricing'}>$14</Typography>
                </div>
            </Grid>
        </CardDiv>
    );
};
