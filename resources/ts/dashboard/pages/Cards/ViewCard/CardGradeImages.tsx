import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useState } from 'react';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import Slider from 'react-slick';

import cardPreview from '@shared/assets/cardPreview.png';

import { CardGradeImage } from './CardGradeImage';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: CardGradeImages
 * @date: 11.08.2021
 * @time: 19:52
 */
export function CardGradeImages() {
    const [open, setOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const images = [
        { url: cardPreview + '?id=1', title: 'Front Centering' },
        { url: cardPreview + '?id=2', title: 'Front Surface' },
        { url: cardPreview + '?id=3', title: 'Front Edges' },
        { url: cardPreview + '?id=4', title: 'Back Centering' },
        { url: cardPreview + '?id=5', title: 'Back Surface' },
        { url: cardPreview + '?id=6', title: 'Back Edges' },
    ];

    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const handleSlide = useCallback(
        (event, index: number) => {
            setCurrentSlide(index);
            setOpen(true);
        },
        [setCurrentSlide, setOpen],
    );

    return (
        <Grid container>
            <Box>
                <Typography>Generated Images</Typography>
            </Box>
            <Box display={'block'} width={'100%'}>
                <Slider slidesToShow={5} arrows>
                    {images.map(({ url, title }, index) => (
                        <CardGradeImage key={index} image={url} title={title} index={index} onClick={handleSlide} />
                    ))}
                </Slider>
            </Box>
            {open ? <Lightbox onClose={handleClose} startIndex={currentSlide} images={images} /> : null}
        </Grid>
    );
}

export default CardGradeImages;
