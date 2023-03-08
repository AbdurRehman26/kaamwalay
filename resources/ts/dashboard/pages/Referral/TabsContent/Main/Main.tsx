import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import EarnCommission from '@shared/assets/earnCommission.png';
import Pay from '@shared/assets/pay.png';
import ShareLink from '@shared/assets/shareLink.png';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import theme from '@shared/styles/theme';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getReferrerDetail } from '@dashboard/redux/slices/referralProgramSlice';
import ReferralDeactivateBanner from '../../ReferralDeactivateBanner';
import MarketingContent from '../MarketingContent';
import Copylink from './CopyLink';
import SocialShare from './SocialShare';
import WithdrawBox from './WithdrawBox';

const ImageDiv = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
    margin: '10px',
    [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    '.Image': {
        maxWidth: '241px',
        maxHeight: '160px',
    },
    '.ImageHeading': {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        textAlign: 'center',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        marginTop: '10px',
    },
    '.ImageCaption': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '15px 0px',
    },
    '.ImagesSection': {
        maxWidth: '233px',
        margin: '20px 0px',
    },
});

const ShareBox = styled(Grid)({
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    padding: '20px',
    width: '100%',

    '.ShareLinkText': {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: '20px',
    },

    '.Tab': {
        background: '#F5F5F5',
        minWidth: '78px',
        minHeight: '36px',
        '&:not(:first-of-type)': {
            marginLeft: '10px',
        },
    },

    '.Mui-selected': {
        borderLeft: '1px solid #E0E0E0',
        borderRight: '1px solid #E0E0E0',
        background: '#fff',
        zIndex: 2,
    },
    '.MuiTabPanel-root': {
        padding: '24px 0px 0px 0px',
    },
    '.TabList div:nth-of-type(2)::before': {
        content: '""',
        display: 'block',
        width: '100%',
        background: '#E0E0E0',
        position: 'absolute',
        top: '47px',
        left: 0,
        zIndex: 1,
        height: '1px',
    },
    '.TabList div:nth-of-type(3)::before': {
        content: '""',
        display: 'block',
        width: '150%',
        background: '#E0E0E0',
        position: 'absolute',
        top: '47px',
        left: 0,
        zIndex: 1,
        height: '1px',
    },
});

const useStyle = makeStyles({
    indicator: {
        top: '0px',
        zIndex: 2,
    },
});

const styles = {
    MainText: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        marginBottom: '20px',
    },
    ShareLinkText: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '10px 0px',
    },
    InputBox: {
        background: '#FFFFFF',
        border: '1px solid #DEDEDE',
        borderRadius: '4px',
        padding: '10px 15px',
        width: '100%',
    },
    SmallText: {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '10px 0px',
    },
    CopyButton: {
        background: '#F5F5F5',
        borderLeft: '1px solid #E0E0E0',
        borderRadius: '0px 3px 3px 0px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#20BFB8',
    },
    ImagesDivHeading: {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        margin: '50px 0px',
    },
};

export function Main() {
    const [value, setValue] = useState('share-link');
    const classes = useStyle();
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const dispatch = useAppDispatch();
    const referrer = useAppSelector((state) => state.referralProgramSlice.referrerDetail.referrer);
    const { featureReferralDiscountPercentage } = useConfiguration();

    useEffect(() => {
        dispatch(getReferrerDetail());
    }, [dispatch]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    if (_.isEmpty(referrer)) {
        return <CircularProgress />;
    }

    return (
        <>
            {!isSm ? (
                <Grid maxWidth={661}>
                    <Typography sx={styles.MainText}>
                        Share your unique link to refer people to RoboGrading. They will get{' '}
                        {featureReferralDiscountPercentage}% off their first submission and you will{' '}
                        <strong style={{ color: '#20BFB8', textDecoration: 'underline' }}>earn commission</strong> every
                        time they pay & anytime someone they refer pays.{' '}
                    </Typography>
                </Grid>
            ) : (
                <WithdrawBox referrer={referrer} />
            )}
            <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid width={'100%'}>
                    {referrer?.isReferralActive ? (
                        <ShareBox>
                            <Typography className={'ShareLinkText'}>Share Link</Typography>
                            <TabContext value={value}>
                                <TabList
                                    variant="scrollable"
                                    onChange={handleChange}
                                    aria-label="share-tabs"
                                    classes={{
                                        indicator: classes.indicator,
                                    }}
                                    className={'TabList'}
                                >
                                    <Tab
                                        className={'Tab'}
                                        icon={<InsertLinkOutlinedIcon />}
                                        value="share-link"
                                        aria-label="share-link"
                                    />
                                    <Tab
                                        className={'Tab'}
                                        icon={<FacebookOutlinedIcon />}
                                        value="facebook"
                                        aria-label="facebook"
                                    />
                                    <Tab
                                        className={'Tab'}
                                        icon={<TwitterIcon />}
                                        value="twitter"
                                        aria-label="twitter"
                                    />
                                    <Tab
                                        className={'Tab'}
                                        icon={<LinkedInIcon />}
                                        value="linkedin"
                                        aria-label="linkedin"
                                    />
                                    <Tab
                                        className={'Tab'}
                                        icon={<WhatsAppIcon />}
                                        value="whatsapp"
                                        aria-label="whatsapp"
                                    />
                                </TabList>
                                <TabPanel value="share-link">
                                    <Copylink referralUrl={referrer?.referralUrl} />
                                </TabPanel>
                                <TabPanel value="facebook">
                                    <SocialShare name="Facebook" referralUrl={referrer?.referralUrl} />
                                </TabPanel>
                                <TabPanel value="twitter">
                                    <SocialShare name="Twitter" referralUrl={referrer?.referralUrl} />
                                </TabPanel>
                                <TabPanel value="linkedin">
                                    <SocialShare name="Linkedin" referralUrl={referrer?.referralUrl} />
                                </TabPanel>
                                <TabPanel value="whatsapp">
                                    <SocialShare name="Whatsapp" referralUrl={referrer?.referralUrl} />
                                </TabPanel>
                            </TabContext>
                        </ShareBox>
                    ) : (
                        <ReferralDeactivateBanner />
                    )}
                </Grid>
                {!isSm ? <WithdrawBox referrer={referrer} /> : null}
            </Grid>
            <Grid>
                <Typography sx={styles.ImagesDivHeading}>How it works</Typography>
                <ImageDiv>
                    <Grid className={'ImagesSection'}>
                        <div>
                            <img className={'Image'} src={ShareLink} alt={'share-link'} />
                        </div>
                        <div>
                            <Typography className={'ImageHeading'}>Share Your Link</Typography>
                            <Typography className={'ImageCaption'}>
                                Share your link with all your friends & followers.
                            </Typography>
                        </div>
                    </Grid>
                    <Grid className={'ImagesSection'}>
                        <div>
                            <img className={'Image'} src={Pay} alt={'pay'} />
                        </div>
                        <div>
                            <Typography className={'ImageHeading'}>They Pay</Typography>
                            <Typography className={'ImageCaption'}>
                                They click your link to sign up & pay for a submission.
                            </Typography>
                        </div>
                    </Grid>
                    <Grid className={'ImagesSection'}>
                        <div>
                            <img className={'Image'} src={EarnCommission} alt={'earn-commission'} />
                        </div>
                        <div>
                            <Typography className={'ImageHeading'}>You Earn Commission</Typography>
                            <Typography className={'ImageCaption'}>
                                You earn commission every time they pay or someone they refer pays.
                            </Typography>
                        </div>
                    </Grid>
                </ImageDiv>
            </Grid>
            <MarketingContent isMain={true} />
        </>
    );
}

export default Main;
