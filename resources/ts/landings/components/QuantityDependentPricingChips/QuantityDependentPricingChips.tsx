import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const HomePriceRange = styled(Grid)({
    '.HomePriceRangeMobile': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    '.HomePriceRange': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    '.HomePriceRangeDiv': {
        border: '1px solid rgba(255, 255, 255, 0.7)',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginRight: '20px',
    },
    '.HomePriceRangeDivMobile': {
        border: '1px solid rgba(255, 255, 255, 0.7)',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginRight: '0px',
        margin: '6px',
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
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    return (
        <HomePriceRange>
            <div className={isMobile ? 'HomePriceRangeMobile' : 'HomePriceRange'}>
                <div className={isMobile ? 'HomePriceRangeDivMobile' : 'HomePriceRangeDiv'}>
                    <Button className={'HomePriceText'}>1-20 Cards</Button>
                </div>
                <div className={isMobile ? 'HomePriceRangeDivMobile' : 'HomePriceRangeDiv'}>
                    <Button className={'HomePriceText'}>21-50 Cards</Button>
                </div>
                <div className={isMobile ? 'HomePriceRangeDivMobile' : 'HomePriceRangeDiv'}>
                    <Button className={'HomePriceText'}>51-100 Cards</Button>
                </div>
                <div className={isMobile ? 'HomePriceRangeDivMobile' : 'HomePriceRangeDiv'}>
                    <Button className={'HomePriceText'}>101-200 Cards</Button>
                </div>
                <div className={'HomePriceRangeDivSelected'}>
                    <Button className={'HomePriceTextSelected'}>200+ Cards</Button>
                </div>
            </div>
        </HomePriceRange>
    );
}
