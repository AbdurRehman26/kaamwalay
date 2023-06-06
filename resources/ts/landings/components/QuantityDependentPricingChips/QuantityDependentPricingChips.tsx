import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import theme from '@shared/styles/theme';
import { PriceCard } from './PriceCard';

const HomePriceRange = styled(Grid)({
    '.HomePriceRange': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            padding: '15px 5px',
            flexWrap: 'wrap',
        },
    },
    '.HomePriceRangeDiv': {
        border: '1px solid rgba(255, 255, 255, 0.7)',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginRight: '20px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '0px',
            margin: '6px',
        },
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
        marginRight: '20px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '0px',
            margin: '6px',
        },
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

interface props {
    content: string;
}

export default function QuantityDependentPricingChips({ content }: props) {
    const [data, setData] = useState<[]>([]);
    const [selected, setSelected] = useState('100');
    const object = JSON.parse(content);

    function findPrice(min: any, max: any) {
        setData(
            object?.filter((item: any) => {
                if (item.min_cards === min && item.max_cards === max) {
                    return item;
                }
            }),
        );
    }

    useEffect(() => {
        setData(
            object?.filter((item: any) => {
                if (item.max_cards === null) {
                    return item;
                }
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HomePriceRange>
                <div className={'HomePriceRange'}>
                    <div className={selected === '1' ? 'HomePriceRangeDivSelected' : 'HomePriceRangeDiv'}>
                        <Button
                            className={selected === '1' ? 'HomePriceTextSelected' : 'HomePriceText'}
                            onClick={() => {
                                findPrice(1, 99);
                                setSelected('1');
                            }}
                        >
                            1-99 Cards
                        </Button>
                    </div>
                    <div className={selected === '100' ? 'HomePriceRangeDivSelected' : 'HomePriceRangeDiv'}>
                        <Button
                            className={selected === '100' ? 'HomePriceTextSelected' : 'HomePriceText'}
                            onClick={() => {
                                findPrice(100, null);
                                setSelected('100');
                            }}
                        >
                            100+ Cards
                        </Button>
                    </div>
                </div>
            </HomePriceRange>
            <PriceCard data={data} />
        </>
    );
}
