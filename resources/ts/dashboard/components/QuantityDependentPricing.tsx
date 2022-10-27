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

interface props {
    priceRanges: any;
}

export const QuantityDependentPricing = ({ priceRanges }: props) => {
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
                    {priceRanges?.map((item: any) => (
                        <Typography className={'Quantity'}>
                            {item?.minCards === 201 ? '200+' : item?.minCards}
                            {item?.minCards !== 201 ? '-' : ''}
                            {item?.maxCards}
                        </Typography>
                    ))}
                </div>
                <div className={'PricingDiv'}>
                    {priceRanges?.map((item: any) => (
                        <Typography className={'Pricing'}>${item?.price}</Typography>
                    ))}
                </div>
            </Grid>
        </CardDiv>
    );
};
