import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useCallback, useState } from 'react';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import Slider from 'react-slick';
import { CardGradeImage } from './CardGradeImage';

interface CardGradeImagesProps {
    images: undefined | { url: string; title: string }[];
}
/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: CardGradeImages
 * @date: 11.08.2021
 * @time: 19:52
 */
export function CardGradeImages({ images }: CardGradeImagesProps) {
    const [open, setOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const theme = useTheme();
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
            <Box display={'block'} width={'100%'} paddingX={'12px'}>
                <Slider
                    slidesToShow={5}
                    responsive={[
                        {
                            breakpoint: theme.breakpoints.values['md'],
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                            },
                        },
                        {
                            breakpoint: theme.breakpoints.values['sm'],
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            },
                        },
                    ]}
                    arrows
                >
                    {!images
                        ? []
                        : images.map(({ url, title }, index) => (
                              <CardGradeImage
                                  key={index}
                                  image={url}
                                  title={title}
                                  index={index}
                                  onClick={handleSlide}
                              />
                          ))}
                </Slider>
            </Box>
            {open ? <Lightbox onClose={handleClose} startIndex={currentSlide} images={images} /> : null}
        </Grid>
    );
}

export default CardGradeImages;
