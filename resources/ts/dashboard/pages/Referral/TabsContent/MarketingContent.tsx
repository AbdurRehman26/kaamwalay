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
import theme from '@shared/styles/theme';

const images = [
    {
        id: 0,
        url: agsPartnerProgramPost1,
        title: 'agsPartnerProgramPost1',
    },
    {
        id: 1,
        url: agsPartnerProgramPost2,
        title: 'agsPartnerProgramPost2',
    },
    {
        id: 2,
        url: agsPartnerProgramPost3,
        title: 'agsPartnerProgramPost3',
    },
    {
        id: 3,
        url: agsPartnerProgramPost4,
        title: 'agsPartnerProgramPost4',
    },
    {
        id: 4,
        url: agsPartnerProgramPost5,
        title: 'agsPartnerProgramPost5',
    },
    {
        id: 5,
        url: agsPartnerProgramPost6,
        title: 'agsPartnerProgramPost6',
    },
    {
        id: 6,
        url: agsPartnerProgramPost7,
        title: 'agsPartnerProgramPost7',
    },
    {
        id: 7,
        url: agsPartnerProgramPost8,
        title: 'agsPartnerProgramPost8',
    },
    {
        id: 8,
        url: agsPartnerProgramPost9,
        title: 'agsPartnerProgramPost9',
    },
    {
        id: 9,
        url: agsPartnerProgramPost10,
        title: 'agsPartnerProgramPost10',
    },
    {
        id: 10,
        url: agsPartnerProgramPost11,
        title: 'agsPartnerProgramPost11',
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
    '.MarketingContentImageDiv': {
        width: '217px',
        cursor: 'pointer',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '50%',
        },
        [theme.breakpoints.between(768, 1024)]: {
            maxWidth: '25%',
        },
    },
    '.MarketingContentImage': {
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
    expandable?: boolean;
}

export function MarketingContent({ expandable }: props) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const handleClick = useCallback((value: number) => {
        setOpen(true);
        setIndex(value);
    }, []);

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
                        ? images.slice(0, 8).map((data: any) => (
                              <div className={'MarketingContentImageDiv'}>
                                  <ButtonBase onClick={() => handleClick(data.id)}>
                                      <img className={'MarketingContentImage'} src={data.url} alt={data.title} />
                                  </ButtonBase>
                              </div>
                          ))
                        : images.map((data: any) => (
                              <div className={'MarketingContentImageDiv'}>
                                  <ButtonBase onClick={() => handleClick(data.id)}>
                                      <img className={'MarketingContentImage'} src={data.url} alt={data.title} />
                                  </ButtonBase>
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
