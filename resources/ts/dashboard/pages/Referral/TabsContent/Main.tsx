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

const ShareBox = styled(Grid)({
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    marginTop: '20px',
    padding: '20px',

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
        '&:not(:first-of-type)': {
            marginLeft: '10px',
        },
    },

    '.Mui-selected': {
        borderLeft: '1px solid #E0E0E0',
        borderRight: '1px solid #E0E0E0',
        background: '#fff',
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
                        <Tab className={'Tab'} icon={<FacebookOutlinedIcon />} value="facebook" aria-label="facebook" />
                        <Tab className={'Tab'} icon={<TwitterIcon />} value="twitter" aria-label="twitter" />
                        <Tab className={'Tab'} icon={<LinkedInIcon />} value="linkedin" aria-label="linkedin" />
                        <Tab className={'Tab'} icon={<WhatsAppIcon />} value="whatsapp" aria-label="whatsapp" />
                        <Tab className={'Tab'} icon={<EmailOutlinedIcon />} value="email" aria-label="email" />
                    </TabList>
                    <TabPanel value="share-link">1</TabPanel>
                    <TabPanel value="facebook">2</TabPanel>
                    <TabPanel value="twitter">3</TabPanel>
                    <TabPanel value="linkedin">4</TabPanel>
                    <TabPanel value="whatsapp">5</TabPanel>
                    <TabPanel value="email">6</TabPanel>
                </TabContext>
            </ShareBox>
        </>
    );
}

export default Main;
