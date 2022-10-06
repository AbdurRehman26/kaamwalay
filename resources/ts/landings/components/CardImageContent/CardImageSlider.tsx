import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FreeMode, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { setEditLabelDialog } from '../../redux/slices/modalSlice';
import CardImageModal from './CardImageModal';

const CardImageDiv = styled(Grid)({
    '.mySwiper2': {
        height: '80%',
        width: '50%',
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
});

interface CardImageSliderProp {
    array: any;
}

export function CardImageSlider({ array }: CardImageSliderProp) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const dispatch = useDispatch();

    const handleDialog = useCallback(async () => {
        dispatch(setEditLabelDialog(true));
    }, [dispatch]);

    return (
        <CardImageDiv>
            <CardImageModal />
            <Swiper
                loop={false}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Thumbs]}
                className={'mySwiper2'}
            >
                <SwiperSlide onClick={handleDialog}>
                    <img src="https://pokemon-statics.s3.amazonaws.com/media/front_slab/000119_AGozHp1.jpg" alt={''} />
                </SwiperSlide>
                <SwiperSlide onClick={handleDialog}>
                    <img src="https://pokemon-statics.s3.amazonaws.com/media/back_slab/000120_0wgmQF1.jpg" alt={''} />
                </SwiperSlide>
            </Swiper>
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
                <SwiperSlide>
                    <img src="https://pokemon-statics.s3.amazonaws.com/media/front_slab/000119_AGozHp1.jpg" alt={''} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://pokemon-statics.s3.amazonaws.com/media/back_slab/000120_0wgmQF1.jpg" alt={''} />
                </SwiperSlide>
            </Swiper>
        </CardImageDiv>
    );
}

export default CardImageSlider;
