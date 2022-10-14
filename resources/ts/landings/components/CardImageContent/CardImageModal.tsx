import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { FreeMode, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { setEditLabelDialog } from '../../redux/slices/modalSlice';
import { RootState } from '../../redux/store';

const CardImageDiv = styled(Grid)({
    display: 'flex',
    '.mySwiper2': {
        width: '635px',
        background: '#000',
        '.swiper-wrapper': {
            '.swiper-slide': {
                display: 'flex',
                justifyContent: 'center',
            },
        },
        '.react-transform-wrapper': {
            width: '100%',
            height: '100%',
        },
        '.swiper-button-prev': {
            display: 'none',
        },
        '.swiper-button-next': {
            display: 'none',
        },
        img: {
            width: '305px',
            margin: '30px',
        },
    },
    '.mySwiper': {
        width: '160px',
        '.swiper-wrapper': {
            flexWrap: 'wrap',
            height: '80%',
            '.swiper-slide': {
                width: '160px!important',
                height: '200px!important',
                marginRight: '0px!important',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
                img: {
                    borderRadius: '4px',
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
        padding: '30px 24px',
    },
});

interface props {
    imagesJson: any;
}

export function CardImageModal({ imagesJson }: props) {
    const labelDialog = useSelector((state: RootState) => state.modal.openLabelDialog.labelDialog);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const dispatch = useDispatch();

    const handleModal = useCallback(() => {
        dispatch(setEditLabelDialog(false));
    }, [dispatch]);

    useEffect(() => {
        if (!labelDialog) {
            setThumbsSwiper(null);
        }
    }, [labelDialog]);

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
                        {Object.keys(imagesJson).map((key) => {
                            return (
                                <SwiperSlide>
                                    <img src={imagesJson[key]} alt={''} />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    <Swiper
                        loop={false}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Thumbs]}
                        className={'mySwiper2'}
                    >
                        {Object.keys(imagesJson).map((key) => {
                            return (
                                <SwiperSlide>
                                    <TransformWrapper centerOnInit={true}>
                                        <TransformComponent>
                                            <img src={imagesJson[key]} alt={''} />
                                        </TransformComponent>
                                    </TransformWrapper>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </CardImageDiv>
            </DialogContent>
        </LabelDialog>
    );
}

export default CardImageModal;
