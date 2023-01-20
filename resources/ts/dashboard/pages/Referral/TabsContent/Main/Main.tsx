import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';
import EarnCommission from '@shared/assets/earnCommission.png';
import Pay from '@shared/assets/pay.png';
import ShareLink from '@shared/assets/shareLink.png';
import Copylink from './CopyLink';
import SocialShare from './SocialShare';
import WithDrawBox from './WithDrawBox';

const ImageDiv = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
    margin: '10px',
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
    },
    '.ImageCaption': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        maxWidth: '214px',
    },
});

const ShareBox = styled(Grid)({
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    padding: '20px',
    minWidth: '547px',

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
    },
    '.MuiTabPanel-root': {
        padding: '24px 0px 0px 0px',
    },
});

const useStyle = makeStyles({
    indicator: {
        top: '0px',
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

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <Grid maxWidth={661}>
                <Typography sx={styles.MainText}>
                    Share your unique link to refer people to RoboGrading. They will get 50% off their first submission
                    and you will earn commission every time they pay & anytime someone they refer pays.{' '}
                </Typography>
            </Grid>
            <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ShareBox>
                    <Typography className={'ShareLinkText'}>Share Link</Typography>
                    <TabContext value={value}>
                        <TabList
                            onChange={handleChange}
                            aria-label="share-tabs"
                            classes={{
                                indicator: classes.indicator,
                            }}
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
                            <Tab className={'Tab'} icon={<TwitterIcon />} value="twitter" aria-label="twitter" />
                            <Tab className={'Tab'} icon={<LinkedInIcon />} value="linkedin" aria-label="linkedin" />
                            <Tab className={'Tab'} icon={<WhatsAppIcon />} value="whatsapp" aria-label="whatsapp" />
                            <Tab className={'Tab'} icon={<EmailOutlinedIcon />} value="email" aria-label="email" />
                        </TabList>
                        <TabPanel value="share-link">
                            <Copylink />
                        </TabPanel>
                        <TabPanel value="facebook">
                            <SocialShare name="Facebook" />
                        </TabPanel>
                        <TabPanel value="twitter">
                            <SocialShare name="Twitter" />
                        </TabPanel>
                        <TabPanel value="linkedin">
                            <SocialShare name="Linkedin" />
                        </TabPanel>
                        <TabPanel value="whatsapp">
                            <SocialShare name="Whatsapp" />
                        </TabPanel>
                        <TabPanel value="email"></TabPanel>
                    </TabContext>
                </ShareBox>
                <WithDrawBox />
            </Grid>
            <Grid>
                <Typography sx={styles.ImagesDivHeading}>How it works</Typography>
                <ImageDiv>
                    <div>
                        <img className={'Image'} src={ShareLink} alt={'share-link'} />
                        <Typography className={'ImageHeading'}>Share Your Link</Typography>
                        <Typography className={'ImageCaption'}>
                            Share your link with all your friends & followers.
                        </Typography>
                    </div>
                    <div>
                        <img className={'Image'} src={Pay} alt={'pay'} />
                        <Typography className={'ImageHeading'}>They Pay</Typography>
                        <Typography className={'ImageCaption'}>
                            They click your link to sign up & pay for a submission.
                        </Typography>
                    </div>
                    <div>
                        <img className={'Image'} src={EarnCommission} alt={'earn-commission'} />
                        <Typography className={'ImageHeading'}>You Earn Commission</Typography>
                        <Typography className={'ImageCaption'}>
                            You earn commission every time they pay or someone they refer pays.
                        </Typography>
                    </div>
                </ImageDiv>
            </Grid>
        </>
    );
}

export default Main;
