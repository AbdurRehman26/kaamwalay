import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import { Link } from 'react-router-dom';
import marketingContentImage1 from '@shared/assets/marketingContentImage1.jpg';
import marketingContentImage2 from '@shared/assets/marketingContentImage2.jpg';
import marketingContentImage3 from '@shared/assets/marketingContentImage3.jpg';
import marketingContentImage4 from '@shared/assets/marketingContentImage4.jpg';
import marketingContentImage5 from '@shared/assets/marketingContentImage5.jpg';
import marketingContentImage6 from '@shared/assets/marketingContentImage6.jpg';
import marketingContentImage7 from '@shared/assets/marketingContentImage7.jpg';
import marketingContentImage8 from '@shared/assets/marketingContentImage8.jpg';
import marketingContentImage9 from '@shared/assets/marketingContentImage9.jpg';
import marketingContentImage10 from '@shared/assets/marketingContentImage10.jpg';
import marketingContentImage11 from '@shared/assets/marketingContentImage11.jpg';

const images = [
    {
        url: marketingContentImage1,
        title: '',
    },
    {
        url: marketingContentImage2,
        title: '',
    },
    {
        url: marketingContentImage3,
        title: '',
    },
    {
        url: marketingContentImage4,
        title: '',
    },
    {
        url: marketingContentImage5,
        title: '',
    },
    {
        url: marketingContentImage6,
        title: '',
    },
    {
        url: marketingContentImage7,
        title: '',
    },
    {
        url: marketingContentImage8,
        title: '',
    },
    {
        url: marketingContentImage9,
        title: '',
    },
    {
        url: marketingContentImage10,
        title: '',
    },
    {
        url: marketingContentImage11,
        title: '',
    },
];

const MarketingContentDiv = styled(Grid)({
    '.MarketingContentTopDiv': {
        paddingBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    '.MarketingContentHeading': {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        paddingBottom: '5px',
    },
    '.MarketingContentParagraph': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.ImagesDiv': {
        display: 'flex',
        alignItems: 'center',
    },
    '.MarketingContentImageDiv': {
        width: '210px',
        margin: '4px',
        cursor: 'pointer',
    },
    '.MarketingContentImage': {
        width: '210px',
    },
    '.SeeAllButton': {
        background: '#F5F5F5',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#20BFB8',
        boxShadow: 'none',
        padding: '15px',
        '&:hover': {
            background: '#F5F5F5',
        },
    },
    '.ButtonLink': {
        textDecoration: 'none',
    },
});

interface props {
    isMain?: boolean;
}

export function MarketingContent({ isMain }: props) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);

    function handleClick(value: number) {
        setOpen(true);
        setIndex(value);
    }

    return (
        <MarketingContentDiv>
            <Grid className={'MarketingContentTopDiv'}>
                <div>
                    <Typography className={'MarketingContentHeading'}>Marketing Content</Typography>
                    <Typography className={'MarketingContentParagraph'}>
                        Downloadable content you can use to refer your friends and followers.
                    </Typography>
                </div>
                {isMain ? (
                    <div>
                        <Link to={'/referral-program/marketing-content'} className={'ButtonLink'}>
                            <Button variant="contained" className={'SeeAllButton'}>
                                See All
                            </Button>
                        </Link>
                    </div>
                ) : null}
            </Grid>
            <Grid>
                <Grid className={'ImagesDiv'}>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(0)}>
                            <img
                                className={'MarketingContentImage'}
                                src={marketingContentImage1}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(1)}>
                            <img
                                className={'MarketingContentImage'}
                                src={marketingContentImage2}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(2)}>
                            <img
                                className={'MarketingContentImage'}
                                src={marketingContentImage3}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(3)}>
                            <img
                                className={'MarketingContentImage'}
                                src={marketingContentImage4}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                </Grid>
                <Grid className={'ImagesDiv'}>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(4)}>
                            <img
                                className={'MarketingContentImage'}
                                src={marketingContentImage5}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(5)}>
                            <img
                                className={'MarketingContentImage'}
                                src={marketingContentImage6}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(6)}>
                            <img
                                className={'MarketingContentImage'}
                                src={marketingContentImage7}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(7)}>
                            <img
                                className={'MarketingContentImage'}
                                src={marketingContentImage8}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                </Grid>
                {!isMain ? (
                    <Grid className={'ImagesDiv'}>
                        <div className={'MarketingContentImageDiv'}>
                            <ButtonBase onClick={() => handleClick(8)}>
                                <img
                                    className={'MarketingContentImage'}
                                    src={marketingContentImage9}
                                    alt={'MarketingContentImage'}
                                />
                            </ButtonBase>
                        </div>
                        <div className={'MarketingContentImageDiv'}>
                            <ButtonBase onClick={() => handleClick(9)}>
                                <img
                                    className={'MarketingContentImage'}
                                    src={marketingContentImage10}
                                    alt={'MarketingContentImage'}
                                />
                            </ButtonBase>
                        </div>
                        <div className={'MarketingContentImageDiv'}>
                            <ButtonBase onClick={() => handleClick(10)}>
                                <img
                                    className={'MarketingContentImage'}
                                    src={marketingContentImage11}
                                    alt={'MarketingContentImage'}
                                />
                            </ButtonBase>
                        </div>
                    </Grid>
                ) : null}
            </Grid>
            {open ? (
                <>
                    <Lightbox onClose={handleClose} startIndex={index} images={images} />
                    <Button
                        sx={{
                            zIndex: 600000,
                            position: 'fixed',
                            right: '700px',
                            top: '100px',
                            background: '#42E8E0',
                            borderRadius: '24px',
                            padding: '15px 50px',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            textAlign: 'center',
                            letterSpacing: '0.35px',
                            color: 'rgba(0, 0, 0, 0.87)',
                            '&:hover': {
                                background: '#42E8E0',
                            },
                        }}
                    >
                        <FileDownloadOutlinedIcon /> DOWNLOAD
                    </Button>
                </>
            ) : null}
        </MarketingContentDiv>
    );
}

export default MarketingContent;
