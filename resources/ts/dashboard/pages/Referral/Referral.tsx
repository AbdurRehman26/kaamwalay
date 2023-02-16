import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ListHeader } from '@dashboard/components/ListHeader';
import CommissionStructure from './TabsContent/CommissionStructure';
import Main from './TabsContent/Main/Main';
import Referrals from './TabsContent/Referrals/Referrals';

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

const useStyle = makeStyles({
    indicator: {
        background: '#20BFB8',
        borderRadius: '4px 4px 0px 0px',
        height: '4px',
    },
});

const styles = {
    TabsBox: {
        borderBottom: 1,
        borderColor: 'divider',
    },
    TabContextDiv: {
        flexWrap: 'nowrap',
        marginTop: '20px',
    },
    TabsLink: {
        textTransform: 'capitalize',
    },
    TabsPanel: {
        padding: '24px 0px',
        width: '100%',
    },
    PayoutIcon: {
        marginLeft: 'auto',
        color: '#20BFB8',
    },
};

export function Referral() {
    const { tab } = useParams<{ tab: string }>();
    const classes = useStyle();
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    return (
        <>
            <ListHeader
                headline={'Referral Program'}
                noMargin
                noSearch
                isReferral
                actions={isSm ? <SettingsOutlinedIcon sx={styles.PayoutIcon} /> : null}
            >
                {!isSm ? (
                    <PayoutButton variant="outlined" startIcon={<SettingsOutlinedIcon />}>
                        payout settings
                    </PayoutButton>
                ) : null}
            </ListHeader>
            <TabContext value={tab ?? 'main'}>
                <Grid container direction={'column'} sx={styles.TabContextDiv}>
                    <Box sx={styles.TabsBox}>
                        <TabList
                            variant="scrollable"
                            classes={{
                                indicator: classes.indicator,
                            }}
                        >
                            <Tab
                                component={Link}
                                to={'/referral-program/main'}
                                value={'main'}
                                label="Main"
                                sx={styles.TabsLink}
                            />
                            <Tab
                                component={Link}
                                to={'/referral-program/referrals'}
                                value={'referrals'}
                                label="Referrals"
                                sx={styles.TabsLink}
                            />
                            {/* <Tab
                                component={Link}
                                to={'/referral-program/with-drawals'}
                                value={'with-drawals'}
                                label="Withdrawals"
                                sx={styles.TabsLink}
                            /> */}
                            <Tab
                                component={Link}
                                to={'/referral-program/commission-structure'}
                                value={'commission-structure'}
                                label="Commission Structure"
                                sx={styles.TabsLink}
                            />
                            {/* <Tab
                                component={Link}
                                to={'/referral-program/marketing-content'}
                                value={'marketing-content'}
                                label="Marketing Content"
                                sx={styles.TabsLink}
                            /> */}
                        </TabList>
                    </Box>
                    <TabPanel value={'main'} sx={styles.TabsPanel}>
                        <Main />
                    </TabPanel>
                    <TabPanel value={'referrals'} sx={styles.TabsPanel}>
                        <Referrals />
                    </TabPanel>
                    <TabPanel value={'commission-structure'} sx={styles.TabsPanel}>
                        <CommissionStructure />
                    </TabPanel>
                </Grid>
            </TabContext>
        </>
    );
}

export default Referral;
