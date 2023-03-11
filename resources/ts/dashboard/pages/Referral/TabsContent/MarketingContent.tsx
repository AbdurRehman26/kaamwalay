import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import partnerProgramAgsAd1 from '@shared/assets/partnerProgramAgsAd1.jpg';
import partnerProgramAgsAd2 from '@shared/assets/partnerProgramAgsAd2.jpg';
import partnerProgramAgsAd3 from '@shared/assets/partnerProgramAgsAd3.jpg';
import partnerProgramAgsAd4 from '@shared/assets/partnerProgramAgsAd4.jpg';
import partnerProgramAgsAd5 from '@shared/assets/partnerProgramAgsAd5.jpg';
import partnerProgramAgsAd6 from '@shared/assets/partnerProgramAgsAd6.jpg';
import partnerProgramAgsAd7 from '@shared/assets/partnerProgramAgsAd7.jpg';
import partnerProgramAgsAd8 from '@shared/assets/partnerProgramAgsAd8.jpg';
import partnerProgramAgsAd9 from '@shared/assets/partnerProgramAgsAd9.jpg';
import partnerProgramAgsAd10 from '@shared/assets/partnerProgramAgsAd10.jpg';
import partnerProgramAgsAd11 from '@shared/assets/partnerProgramAgsAd11.jpg';
import theme from '@shared/styles/theme';

const images = [
    {
        url: partnerProgramAgsAd1,
        title: '',
    },
    {
        url: partnerProgramAgsAd2,
        title: '',
    },
    {
        url: partnerProgramAgsAd3,
        title: '',
    },
    {
        url: partnerProgramAgsAd4,
        title: '',
    },
    {
        url: partnerProgramAgsAd5,
        title: '',
    },
    {
        url: partnerProgramAgsAd6,
        title: '',
    },
    {
        url: partnerProgramAgsAd7,
        title: '',
    },
    {
        url: partnerProgramAgsAd8,
        title: '',
    },
    {
        url: partnerProgramAgsAd9,
        title: '',
    },
    {
        url: partnerProgramAgsAd10,
        title: '',
    },
    {
        url: partnerProgramAgsAd11,
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
        [theme.breakpoints.down('sm')]: {
            flexWrap: 'wrap',
        },
    },
    '.MarketingContentImageDiv': {
        width: '210px',
        margin: '4px',
        cursor: 'pointer',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '47%',
        },
        [theme.breakpoints.between(768, 1024)]: {
            maxWidth: '140px',
        },
    },
    '.MarketingContentImage': {
        maxWidth: '210px',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
        },
        [theme.breakpoints.between(768, 1024)]: {
            maxWidth: '100%',
        },
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
            boxShadow: 'none',
        },
    },
    '.ButtonLink': {
        textDecoration: 'none',
    },
    '.SeeAllButtonDiv': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    '.AnchorLink': {
        textDecoration: 'none',
    },
    '.DownloadButton': {
        zIndex: 600000,
        position: 'fixed',
        top: '90%',
        right: '45%',
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
        [theme.breakpoints.down('sm')]: {
            top: '90%',
            right: '25%',
        },
        [theme.breakpoints.between(768, 1024)]: {
            top: '85%',
            right: '35%',
        },
    },
    '.PreviousButton': {
        zIndex: 600000,
        position: 'fixed',
        top: '50%',
        left: '0%',
        [theme.breakpoints.down('sm')]: {
            top: '80%',
        },
        [theme.breakpoints.between(768, 1024)]: {
            top: '85%',
        },
    },
    '.NextButton': {
        zIndex: 600000,
        position: 'fixed',
        top: '50%',
        right: '0%',
        [theme.breakpoints.down('sm')]: {
            top: '80%',
        },
        [theme.breakpoints.between(768, 1024)]: {
            top: '85%',
        },
    },
    '.NavigationIcon': {
        color: '#fff',
        fontSize: '40px',
    },
});

interface props {
    isMain?: boolean;
}

export function MarketingContent({ isMain }: props) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

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
                {isMain && !isSm ? (
                    <div>
                        <Link
                            to={'/referral-program/marketing-content'}
                            className={'ButtonLink'}
                            onClick={() => window.scroll(0, 0)}
                        >
                            <Button variant="contained" className={'SeeAllButton'}>
                                See All
                            </Button>
                        </Link>
                    </div>
                ) : null}
            </Grid>
            <Grid container>
                <Grid className={'ImagesDiv'}>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(0)}>
                            <img
                                className={'MarketingContentImage'}
                                src={partnerProgramAgsAd1}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(1)}>
                            <img
                                className={'MarketingContentImage'}
                                src={partnerProgramAgsAd2}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(2)}>
                            <img
                                className={'MarketingContentImage'}
                                src={partnerProgramAgsAd3}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(3)}>
                            <img
                                className={'MarketingContentImage'}
                                src={partnerProgramAgsAd4}
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
                                src={partnerProgramAgsAd5}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(5)}>
                            <img
                                className={'MarketingContentImage'}
                                src={partnerProgramAgsAd6}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(6)}>
                            <img
                                className={'MarketingContentImage'}
                                src={partnerProgramAgsAd7}
                                alt={'MarketingContentImage'}
                            />
                        </ButtonBase>
                    </div>
                    <div className={'MarketingContentImageDiv'}>
                        <ButtonBase onClick={() => handleClick(7)}>
                            <img
                                className={'MarketingContentImage'}
                                src={partnerProgramAgsAd8}
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
                                    src={partnerProgramAgsAd9}
                                    alt={'MarketingContentImage'}
                                />
                            </ButtonBase>
                        </div>
                        <div className={'MarketingContentImageDiv'}>
                            <ButtonBase onClick={() => handleClick(9)}>
                                <img
                                    className={'MarketingContentImage'}
                                    src={partnerProgramAgsAd10}
                                    alt={'MarketingContentImage'}
                                />
                            </ButtonBase>
                        </div>
                        <div className={'MarketingContentImageDiv'}>
                            <ButtonBase onClick={() => handleClick(11)}>
                                <img
                                    className={'MarketingContentImage'}
                                    src={partnerProgramAgsAd11}
                                    alt={'MarketingContentImage'}
                                />
                            </ButtonBase>
                        </div>
                    </Grid>
                ) : null}
            </Grid>
            {isMain && isSm ? (
                <Grid className={'SeeAllButtonDiv'}>
                    <Link to={'/referral-program/marketing-content'} className={'ButtonLink'}>
                        <Button variant="contained" className={'SeeAllButton'}>
                            See All
                        </Button>
                    </Link>
                </Grid>
            ) : null}
            <Dialog open={open} onClose={handleClose}>
                <img src={images[index].url} alt={images[index].title} />
            </Dialog>
            {open ? (
                <>
                    <a className={'AnchorLink'} href={images[index].url} download>
                        <Button className={'DownloadButton'}>
                            <FileDownloadOutlinedIcon /> DOWNLOAD
                        </Button>
                    </a>
                    <Button disabled={index === 0} onClick={() => setIndex(index - 1)} className={'PreviousButton'}>
                        <KeyboardArrowLeftOutlinedIcon className={'NavigationIcon'} />
                    </Button>
                    <Button
                        disabled={index === images.length - 1}
                        onClick={() => setIndex(index + 1)}
                        className={'NextButton'}
                    >
                        <KeyboardArrowRightOutlinedIcon className={'NavigationIcon'} />
                    </Button>
                </>
            ) : null}
        </MarketingContentDiv>
    );
}

export default MarketingContent;
