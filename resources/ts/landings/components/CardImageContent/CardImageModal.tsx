import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { FreeMode, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { setEditLabelDialog } from '../../redux/slices/modalSlice';
import { RootState } from '../../redux/store';

const CardImageDiv = styled(Grid)({
    display: 'flex',
    '.mySwiper2': {
        width: '100%',
        background: '#000',
        '.swiper-wrapper': {
            '.swiper-slide': {
                display: 'flex',
                justifyContent: 'center',
            },
        },
        '.swiper-button-prev': {
            display: 'none',
        },
        '.swiper-button-next': {
            display: 'none',
        },
        img: {
            width: '305px',
            height: '515px',
        },
    },
    '.mySwiper': {
        '.swiper-wrapper': {
            flexWrap: 'wrap',
            '.swiper-slide': {
                width: '191px!important',
                height: '200px!important',
                img: {
                    width: '117px!important',
                    height: '200px!important',
                },
            },
        },
    },
});

const LabelDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        maxWidth: '800px',
        maxHeight: '700px',
    },
    '& .MuiDialogContent-root': {
        padding: '0px 0px',
    },
    '& .MuiTypography-root': {
        padding: '24px 24px',
    },
});

export function CardImageModal() {
    const labelDialog = useSelector((state: RootState) => state.modal.openLabelDialog.labelDialog);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const dispatch = useDispatch();

    const handleModal = useCallback(() => {
        dispatch(setEditLabelDialog(false));
    }, [dispatch]);

    return (
        <LabelDialog onClose={handleModal} open={labelDialog} fullWidth>
            <DialogTitle>
                <IconButton
                    onClick={handleModal}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ padding: '20px' }}>
                <CardImageDiv>
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
                            <img
                                src="https://pokemon-statics.s3.amazonaws.com/media/front_slab/000119_AGozHp1.jpg"
                                alt={''}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src="https://pokemon-statics.s3.amazonaws.com/media/back_slab/000120_0wgmQF1.jpg"
                                alt={''}
                            />
                        </SwiperSlide>
                    </Swiper>
                    <Swiper
                        loop={false}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Thumbs]}
                        className={'mySwiper2'}
                    >
                        <SwiperSlide>
                            <TransformWrapper>
                                <TransformComponent>
                                    <img
                                        src="https://pokemon-statics.s3.amazonaws.com/media/front_slab/000119_AGozHp1.jpg"
                                        alt={''}
                                    />
                                </TransformComponent>
                            </TransformWrapper>
                        </SwiperSlide>
                        <SwiperSlide>
                            <TransformWrapper>
                                <TransformComponent>
                                    <img
                                        src="https://pokemon-statics.s3.amazonaws.com/media/back_slab/000120_0wgmQF1.jpg"
                                        alt={''}
                                    />
                                </TransformComponent>
                            </TransformWrapper>
                        </SwiperSlide>
                    </Swiper>
                </CardImageDiv>
            </DialogContent>
        </LabelDialog>
    );
}

export default CardImageModal;
