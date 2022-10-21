import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const HomePriceRange = styled(Grid)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // @include breakpoints.down(768) {
    //     flex-wrap: wrap;
    // }
    '.HomePriceRangeDiv': {
        border: '1px solid rgba(255, 255, 255, 0.7)',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginRight: '20px',
        // @include breakpoints.down(768) {
        //     margin-right: '0px',
        //     margin: '6px',
        // }
    },
    '.HomePriceText': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.35px',
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        padding: '10px 15px',
    },
    '.HomePriceRangeDivSelected': {
        border: '2px solid #42e8e0',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    '.HomePriceTextSelected': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.35px',
        color: '#42e8e0',
        textAlign: 'center',
        padding: '10px 15px',
    },
});

export default function QuantityDependentPricingChips() {
    return (
        <HomePriceRange>
            <div className={'HomePriceRangeDiv'}>
                <Button className={'HomePriceText'}>1-20 Cards</Button>
            </div>
            <div className={'HomePriceRangeDiv'}>
                <Button className={'HomePriceText'}>21-50 Cards</Button>
            </div>
            <div className={'HomePriceRangeDiv'}>
                <Button className={'HomePriceText'}>51-100 Cards</Button>
            </div>
            <div className={'HomePriceRangeDiv'}>
                <Button className={'HomePriceText'}>101-200 Cards</Button>
            </div>
            <div className={'HomePriceRangeDivSelected'}>
                <Button className={'HomePriceTextSelected'}>200+ Cards</Button>
            </div>
        </HomePriceRange>
    );
}
