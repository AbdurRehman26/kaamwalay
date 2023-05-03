import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FreeMode, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { setEditLabelDialog } from '../../redux/slices/modalSlice';
import CardImageModal from './CardImageModal';
import CardImageModalMobile from './CardImageModalMobile';

const CardImageDiv = styled(Grid)({
    '.SwiperMultiple': {
        height: '80%',
        width: '50%',
        '.swiper-button-prev': {
            display: 'none',
        },
        '.swiper-button-next': {
            display: 'none',
        },
    },
    '.SwiperSingle': {
        height: '100%',
        width: '75%',
        '.swiper-button-prev': {
            display: 'none',
        },
        '.swiper-button-next': {
            display: 'none',
        },
    },
    '.mySwiper': {
        '.swiper-wrapper': {
            justifyContent: 'center',
        },
    },
    '.Image': {
        borderRadius: '8px',
        filter: 'drop-shadow(0px 4px 5px rgba(0, 0, 0, 0.14)) drop-shadow(0px 1px 10px rgba(0, 0, 0, 0.12)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))',
    },
});

interface CardImageSliderProp {
    images: any;
}

export function CardImageSlider({ images }: CardImageSliderProp) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const imagesJson = JSON.parse(images);

    const handleDialog = useCallback(async () => {
        dispatch(setEditLabelDialog(true));
    }, [dispatch]);

    return (
        <CardImageDiv>
            {isMobile ? <CardImageModalMobile imagesJson={imagesJson} /> : <CardImageModal imagesJson={imagesJson} />}
            <Swiper
                loop={false}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Thumbs]}
                className={Object.keys(imagesJson).length === 1 ? 'SwiperSingle' : 'SwiperMultiple'}
            >
                {Object.keys(imagesJson).map((key) => {
                    return (
                        <SwiperSlide onClick={handleDialog} key={key}>
                            <img src={imagesJson[key]} alt={''} className={'Image'} />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            {Object.keys(imagesJson).length === 1 ? null : (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={false}
                    spaceBetween={10}
                    slidesPerView={2}
                    freeMode={true}
                    watchSlidesProgress={false}
                    modules={[FreeMode, Thumbs]}
                    className={'mySwiper'}
                >
                    {Object.keys(imagesJson).map((key) => {
                        return (
                            <SwiperSlide key={key}>
                                <img src={imagesJson[key]} alt={''} />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}
        </CardImageDiv>
    );
}

export default CardImageSlider;
