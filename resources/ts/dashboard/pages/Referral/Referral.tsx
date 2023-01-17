import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ListHeader } from '@dashboard/components/ListHeader';
import CommissionStructure from './TabsContent/CommissionStructure';
import Main from './TabsContent/Main';
import MarketingContent from './TabsContent/MarketingContent';
import Referrals from './TabsContent/Referrals';
import Withdrawals from './TabsContent/WithDrawals';

const PayoutButton = styled(Button)({
    background: '#FFFFFF',
    border: '1px solid #20BFB8',
    borderRadius: '24px',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center',
    letterSpacing: '0.35px',
    color: '#20BFB8',
    padding: '10px 15px',
});

const styles = {
    TabsBox: {
        borderBottom: 1,
        borderColor: 'divider',
    },
    TabContextDiv: {
        marginTop: '20px',
    },
};

export function Referral() {
    const { tab } = useParams<{ tab: string }>();

    return (
        <>
            <ListHeader headline={'Referral Program'} noMargin noSearch isReferral>
                <PayoutButton variant="outlined" startIcon={<SettingsOutlinedIcon />}>
                    payout settings
                </PayoutButton>
            </ListHeader>
            <TabContext value={tab ?? 'main'}>
                <Grid container direction={'column'} sx={styles.TabContextDiv}>
                    <Box sx={styles.TabsBox}>
                        <TabList indicatorColor={'primary'} textColor={'primary'}>
                            <Tab component={Link} to={'/referral-program/main'} value={'main'} label="Main" />
                            <Tab
                                component={Link}
                                to={'/referral-program/referrals'}
                                value={'referrals'}
                                label="Referrals"
                            />
                            <Tab
                                component={Link}
                                to={'/referral-program/with-drawals'}
                                value={'with-drawals'}
                                label="Withdrawals"
                            />
                            <Tab
                                component={Link}
                                to={'/referral-program/commission-structure'}
                                value={'commission-structure'}
                                label="Commission Structure"
                            />
                            <Tab
                                component={Link}
                                to={'/referral-program/marketing-content'}
                                value={'marketing-content'}
                                label="Marketing Content"
                            />
                        </TabList>
                    </Box>
                    <TabPanel value={'main'}>
                        <Main />
                    </TabPanel>
                    <TabPanel value={'referrals'}>
                        <Referrals />
                    </TabPanel>
                    <TabPanel value={'with-drawals'}>
                        <Withdrawals />
                    </TabPanel>
                    <TabPanel value={'commission-structure'}>
                        <CommissionStructure />
                    </TabPanel>
                    <TabPanel value={'marketing-content'}>
                        <MarketingContent />
                    </TabPanel>
                </Grid>
            </TabContext>
        </>
    );
}

export default Referral;
