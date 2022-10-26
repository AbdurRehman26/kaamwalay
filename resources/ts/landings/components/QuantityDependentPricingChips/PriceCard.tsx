import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';
import CarIcon from '@shared/assets/carIcon.svg';
import DetailedIcon from '@shared/assets/detailedIcon.svg';
import MoneyIcon from '@shared/assets/moneyIcon.svg';
import SlabIcon from '@shared/assets/slabIcon.svg';
import VerifiedIcon from '@shared/assets/verifiedIcon.svg';
import SubmissionButton from '../SubmissionButton/SubmissionButton';

interface props {
    data: any;
}

const SliderHolder = styled(Grid)({
    '.HomePriceColumn': {
        width: 'calc(100% - 24px)',
        minWidth: '284px',
        margin: '12px',
        backgroundColor: '#fff',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    '.HomePriceHeadline': {
        backgroundColor: '#6c31bc',
        width: '100%',
        padding: '16px',
        fontWeight: 900,
        fontSize: '48px',
        lineHeight: '48px',
        color: '#fff',
        textAlign: 'center',
        '.small': {
            color: '#eee',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.15px',
            marginLeft: '-8px',
        },
    },
    '.HomePriceFeatures': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        flexDirection: 'column',
    },
    '.HomePriceFeature': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginBottom: '16px',
    },
    '.HomePriceFeatureText': {
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        '.Bold': {
            fontWeight: 500,
            margin: '0 4px',
        },
    },
    '.SubmitButton': {
        background: '#20BFB8',
        borderRadius: '28px',
        color: 'white',
        margin: '15px 24px',
        padding: '15px 24px',
    },
});

export const PriceCard = ({ data }: props) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Grid sx={{ margin: '50px' }}>
            <Slider {...settings}>
                {data?.map((item: any) => (
                    <SliderHolder>
                        <div className={'HomePriceColumn'}>
                            <h4 className={'HomePriceHeadline'}>
                                ${item?.price} <span className={'small'}>/Card</span>
                            </h4>
                            <ul className={'HomePriceFeatures'}>
                                <li className={'HomePriceFeature'}>
                                    <p className={'HomePriceFeatureText'}>
                                        <img src={CarIcon} alt="" className={'Home-priceFeatureIcon'} />
                                        <span className={'Bold'}>{}</span> Turnaround
                                    </p>
                                </li>
                                <li className={'HomePriceFeature'}>
                                    <p className={'HomePriceFeatureText'}>
                                        <img src={MoneyIcon} alt="" className={'Home-priceFeatureIcon'} />
                                        Up to <span className={'Bold'}>${}</span> Insurance
                                    </p>
                                </li>
                                <li className={'HomePriceFeature'}>
                                    <p className={'HomePriceFeatureText'}>
                                        <img src={VerifiedIcon} alt="" className={'Home-priceFeatureIcon'} />
                                        Grade Certificate
                                    </p>
                                </li>
                                <li className={'HomePriceFeature'}>
                                    <p className={'HomePriceFeatureText'}>
                                        <img src={DetailedIcon} alt="" className={'Home-priceFeatureIcon'} />
                                        Detailed Grade Breakdown
                                    </p>
                                </li>
                                <li className={'HomePriceFeature'}>
                                    <p className={'HomePriceFeatureText'}>
                                        <img src={SlabIcon} alt="" className={'Home-priceFeatureIcon'} />
                                        AGS Slab
                                    </p>
                                </li>
                            </ul>
                            <SubmissionButton
                                className={'SubmitButton'}
                                textColor={'white'}
                                buttonContent={'Select & start submission'}
                            />
                        </div>
                    </SliderHolder>
                ))}
            </Slider>
        </Grid>
    );
};
