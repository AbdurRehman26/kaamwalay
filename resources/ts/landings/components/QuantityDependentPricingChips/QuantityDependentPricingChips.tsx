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
    content: any;
}

export default function QuantityDependentPricingChips({ content }: props) {
    const [data, setData] = useState<[]>([]);
    const [selected, setSelected] = useState('200');
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
                if (item.min_cards === 201 && item.max_cards === null) {
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
                                findPrice(1, 20);
                                setSelected('1');
                            }}
                        >
                            1-20 Cards
                        </Button>
                    </div>
                    <div className={selected === '21' ? 'HomePriceRangeDivSelected' : 'HomePriceRangeDiv'}>
                        <Button
                            className={selected === '21' ? 'HomePriceTextSelected' : 'HomePriceText'}
                            onClick={() => {
                                findPrice(21, 50);
                                setSelected('21');
                            }}
                        >
                            21-50 Cards
                        </Button>
                    </div>
                    <div className={selected === '51' ? 'HomePriceRangeDivSelected' : 'HomePriceRangeDiv'}>
                        <Button
                            className={selected === '51' ? 'HomePriceTextSelected' : 'HomePriceText'}
                            onClick={() => {
                                findPrice(51, 100);
                                setSelected('51');
                            }}
                        >
                            51-100 Cards
                        </Button>
                    </div>
                    <div className={selected === '101' ? 'HomePriceRangeDivSelected' : 'HomePriceRangeDiv'}>
                        <Button
                            className={selected === '101' ? 'HomePriceTextSelected' : 'HomePriceText'}
                            onClick={() => {
                                findPrice(101, 200);
                                setSelected('101');
                            }}
                        >
                            101-200 Cards
                        </Button>
                    </div>
                    <div className={selected === '200' ? 'HomePriceRangeDivSelected' : 'HomePriceRangeDiv'}>
                        <Button
                            className={selected === '200' ? 'HomePriceTextSelected' : 'HomePriceText'}
                            onClick={() => {
                                findPrice(201, null);
                                setSelected('200');
                            }}
                        >
                            200+ Cards
                        </Button>
                    </div>
                </div>
            </HomePriceRange>
            <PriceCard data={data} />
        </>
    );
}
