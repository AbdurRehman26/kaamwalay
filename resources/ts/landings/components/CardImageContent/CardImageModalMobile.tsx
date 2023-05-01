import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { FreeMode, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { setEditLabelDialog } from '../../redux/slices/modalSlice';
import { RootState } from '../../redux/store';

const CardImageDiv = styled(Grid)({
    '.SwiperToolTip': {
        background: '#000',
        borderRadius: '4px',
        textAlign: 'center',
        padding: '15px 15px',
        margin: 'auto',
        width: '50%',
        color: '#fff',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',
        marginTop: '50px',
    },
    '.SwiperToolTipHide': {
        display: 'none',
    },
    '.mySwiper2': {
        '.swiper-slide': {
            display: 'flex',
            justifyContent: 'center',
        },
        '.react-transform-wrapper': {
            width: '100%',
        },
        '.swiper-button-prev': {
            display: 'none',
        },
        '.swiper-button-next': {
            display: 'none',
        },
        img: {
            width: '319px',
        },
    },
});

const ModalFooter = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderTop: '1px solid #E0E0E0',
    padding: '15px 15px',
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
    '.mySwiper': {
        '.swiper-wrapper': {
            justifyContent: 'center',
            '.swiper-slide': {
                width: '28px!important',
                height: '48px',
            },
        },
    },
});

const styles = {
    ModalHeader: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        borderBottom: '1px solid #E0E0E0',
        padding: '15px 15px',
        marginBottom: '40px',
    },
    Box: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        overflowY: 'scroll',
    },
};

interface props {
    imagesJson: any;
}

export function CardImageModalMobile({ imagesJson }: props) {
    const labelDialog = useSelector((state: RootState) => state.modal.openLabelDialog.labelDialog);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [toolTipClass, setToolTipClass] = useState('SwiperToolTip');
    const dispatch = useDispatch();

    const handleModal = useCallback(() => {
        dispatch(setEditLabelDialog(false));
    }, [dispatch]);

    useEffect(() => {
        if (!labelDialog) {
            setThumbsSwiper(null);
            setToolTipClass('SwiperToolTip');
        }
    }, [labelDialog]);

    return (
        <Modal open={labelDialog}>
            <Box sx={styles.Box}>
                <Grid sx={styles.ModalHeader}>
                    <IconButton sx={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={handleModal}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Grid>
                <CardImageDiv>
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
                                <SwiperSlide key={key}>
                                    <TransformWrapper
                                        centerOnInit={true}
                                        onZoomStart={() => setToolTipClass('SwiperToolTipHide')}
                                    >
                                        <TransformComponent>
                                            <img src={imagesJson[key]} alt={''} />
                                        </TransformComponent>
                                    </TransformWrapper>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    <Typography className={toolTipClass}>Pinch/Scroll to Zoom</Typography>
                </CardImageDiv>
                <ModalFooter>
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
                </ModalFooter>
            </Box>
        </Modal>
    );
}

export default CardImageModalMobile;
