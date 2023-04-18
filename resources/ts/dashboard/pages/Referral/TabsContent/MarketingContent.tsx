import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import agsPartnerProgramPost1 from '@shared/assets/agsPartnerProgramPost1.jpg';
import agsPartnerProgramPost2 from '@shared/assets/agsPartnerProgramPost2.jpg';
import agsPartnerProgramPost3 from '@shared/assets/agsPartnerProgramPost3.jpg';
import agsPartnerProgramPost4 from '@shared/assets/agsPartnerProgramPost4.jpg';
import agsPartnerProgramPost5 from '@shared/assets/agsPartnerProgramPost5.jpg';
import agsPartnerProgramPost6 from '@shared/assets/agsPartnerProgramPost6.jpg';
import agsPartnerProgramPost7 from '@shared/assets/agsPartnerProgramPost7.jpg';
import agsPartnerProgramPost8 from '@shared/assets/agsPartnerProgramPost8.jpg';
import agsPartnerProgramPost9 from '@shared/assets/agsPartnerProgramPost9.jpg';
import agsPartnerProgramPost10 from '@shared/assets/agsPartnerProgramPost10.jpg';
import agsPartnerProgramPost11 from '@shared/assets/agsPartnerProgramPost11.jpg';
import agsPartnerProgramPost12 from '@shared/assets/agsPartnerProgramPost12.mp4';
import agsPartnerProgramPost13 from '@shared/assets/agsPartnerProgramPost13.mp4';
import agsPartnerProgramPost14 from '@shared/assets/agsPartnerProgramPost14.mp4';
import agsPartnerProgramPost15 from '@shared/assets/agsPartnerProgramPost15.mp4';
import agsPartnerProgramThumbnail12 from '@shared/assets/agsPartnerProgramThumbnail12.svg';
import agsPartnerProgramThumbnail13 from '@shared/assets/agsPartnerProgramThumbnail13.svg';
import agsPartnerProgramThumbnail14 from '@shared/assets/agsPartnerProgramThumbnail14.svg';
import agsPartnerProgramThumbnail15 from '@shared/assets/agsPartnerProgramThumbnail15.svg';
import theme from '@shared/styles/theme';

const marketingContent = [
    {
        id: 0,
        url: agsPartnerProgramPost13,
        thumbnail: agsPartnerProgramThumbnail13,
        title: 'agsPartnerProgramPost12',
        type: 'video',
    },
    {
        id: 1,
        url: agsPartnerProgramPost15,
        thumbnail: agsPartnerProgramThumbnail15,
        title: 'agsPartnerProgramPost12',
        type: 'video',
    },
    {
        id: 2,
        url: agsPartnerProgramPost12,
        thumbnail: agsPartnerProgramThumbnail12,
        title: 'agsPartnerProgramPost12',
        type: 'video',
    },
    {
        id: 3,
        url: agsPartnerProgramPost14,
        thumbnail: agsPartnerProgramThumbnail14,
        title: 'agsPartnerProgramPost12',
        type: 'video',
    },
    {
        id: 4,
        url: agsPartnerProgramPost2,
        title: 'agsPartnerProgramPost2',
        type: 'image',
    },
    {
        id: 5,
        url: agsPartnerProgramPost3,
        title: 'agsPartnerProgramPost3',
        type: 'image',
    },
    {
        id: 6,
        url: agsPartnerProgramPost4,
        title: 'agsPartnerProgramPost4',
        type: 'image',
    },
    {
        id: 7,
        url: agsPartnerProgramPost5,
        title: 'agsPartnerProgramPost5',
        type: 'image',
    },
    {
        id: 8,
        url: agsPartnerProgramPost6,
        title: 'agsPartnerProgramPost6',
        type: 'image',
    },
    {
        id: 9,
        url: agsPartnerProgramPost7,
        title: 'agsPartnerProgramPost7',
        type: 'image',
    },
    {
        id: 10,
        url: agsPartnerProgramPost8,
        title: 'agsPartnerProgramPost8',
        type: 'image',
    },
    {
        id: 11,
        url: agsPartnerProgramPost9,
        title: 'agsPartnerProgramPost9',
        type: 'image',
    },
    {
        id: 12,
        url: agsPartnerProgramPost10,
        title: 'agsPartnerProgramPost10',
        type: 'image',
    },
    {
        id: 13,
        url: agsPartnerProgramPost11,
        title: 'agsPartnerProgramPost11',
        type: 'image',
    },
    {
        id: 14,
        url: agsPartnerProgramPost1,
        title: 'agsPartnerProgramPost1',
        type: 'image',
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
        flexWrap: 'wrap',
    },
    '.MarketingContentDiv': {
        width: '217px',
        position: 'relative',
        cursor: 'pointer',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '50%',
        },
        [theme.breakpoints.between(768, 1024)]: {
            maxWidth: '25%',
        },
    },
    '.MarketingContentPlayIcon': {
        color: 'white',
        position: 'absolute',
        top: '3%',
        right: '3%',
    },
    '.MarketingContent': {
        maxWidth: '217px',
        padding: '4px',
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
    },
    '.PreviousButton': {
        zIndex: 600000,
        position: 'fixed',
        top: '50vh',
        left: '0%',
        [theme.breakpoints.down('sm')]: {
            top: '80vh',
        },
    },
    '.NextButton': {
        zIndex: 600000,
        position: 'fixed',
        top: '50vh',
        right: '0%',
        [theme.breakpoints.down('sm')]: {
            top: '80vh',
        },
    },
    '.NavigationIcon': {
        color: '#fff',
        fontSize: '40px',
    },
    '.DownloadGrid': {
        zIndex: 600000,
        position: 'fixed',
        bottom: '10px',
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
});

const useStyles = makeStyles({
    dialogImage: {
        maxHeight: '75vh',
    },
    dialogVideo: {
        height: '600px',
        width: '600px',
        background: '#000000',
        [theme.breakpoints.down('sm')]: {
            height: '55vh',
            width: '300px',
        },
    },
});

interface props {
    expandable?: boolean;
}

export function MarketingContent({ expandable }: props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const handleClick = useCallback((value: number) => {
        setOpen(true);
        setIndex(value);
    }, []);

    const getButtonContent = (type: string) => {
        return type === 'video' ? (
            <IconButton className={'MarketingContentPlayIcon'}>
                <PlayArrow />
            </IconButton>
        ) : null;
    };

    const getContent = (index: number) => {
        return marketingContent[index].type === 'video' ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video controls className={classes.dialogVideo} autoPlay key={marketingContent[index].url}>
                <source src={marketingContent[index].url} />
            </video>
        ) : (
            <img
                src={marketingContent[index].url}
                alt={marketingContent[index].title}
                className={classes.dialogImage}
            />
        );
    };

    return (
        <MarketingContentDiv>
            <Grid className={'MarketingContentTopDiv'}>
                <div>
                    <Typography className={'MarketingContentHeading'}>Marketing Content</Typography>
                    <Typography className={'MarketingContentParagraph'}>
                        Downloadable content you can use to refer your friends and followers.
                    </Typography>
                </div>
                {expandable && !isSm ? (
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
                    {expandable
                        ? marketingContent.slice(0, 8).map((data: any) => (
                              <div className={'MarketingContentDiv'} key={data.id}>
                                  <ButtonBase onClick={() => handleClick(data.id)}>
                                      <img
                                          className={'MarketingContent'}
                                          src={data.type === 'image' ? data.url : data.thumbnail}
                                          alt={data.title}
                                      />
                                      {getButtonContent(data.type)}
                                  </ButtonBase>
                              </div>
                          ))
                        : marketingContent.map((data: any) => (
                              <div className={'MarketingContentDiv'} key={data.id}>
                                  <ButtonBase onClick={() => handleClick(data.id)}>
                                      <img
                                          className={'MarketingContent'}
                                          src={data.type === 'image' ? data.url : data.thumbnail}
                                          alt={data.title}
                                      />
                                  </ButtonBase>
                                  {getButtonContent(data.type)}
                              </div>
                          ))}
                </Grid>
            </Grid>
            {expandable && isSm ? (
                <Grid className={'SeeAllButtonDiv'}>
                    <Link
                        to={'/referral-program/marketing-content'}
                        className={'ButtonLink'}
                        onClick={() => window.scroll(0, 0)}
                    >
                        <Button variant="contained" className={'SeeAllButton'}>
                            See All
                        </Button>
                    </Link>
                </Grid>
            ) : null}
            <Dialog open={open} onClose={handleClose}>
                {getContent(index)}
            </Dialog>
            {open ? (
                <>
                    <Grid className={'DownloadGrid'}>
                        <a className={'AnchorLink'} href={marketingContent[index].url} download>
                            <Button className={'DownloadButton'}>
                                <FileDownloadOutlinedIcon /> DOWNLOAD
                            </Button>
                        </a>
                    </Grid>
                    <Button disabled={index === 0} onClick={() => setIndex(index - 1)} className={'PreviousButton'}>
                        <KeyboardArrowLeftOutlinedIcon className={'NavigationIcon'} />
                    </Button>
                    <Button
                        disabled={index === marketingContent.length - 1}
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
