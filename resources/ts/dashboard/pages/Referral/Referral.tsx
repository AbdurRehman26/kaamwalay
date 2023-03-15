import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ListHeader } from '@dashboard/components/ListHeader';
import CommissionStructure from './TabsContent/CommissionStructure';
import Main from './TabsContent/Main/Main';
import MarketingContent from './TabsContent/MarketingContent';
import Referrals from './TabsContent/Referrals/Referrals';
import Withdrawals from './TabsContent/Withdrawals/Withdrawals';

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
};

export function Referral() {
    const { tab } = useParams<{ tab: string }>();
    const classes = useStyle();

    return (
        <>
            <ListHeader headline={'Partner Program'} noMargin noSearch isReferral></ListHeader>
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
                            <Tab
                                component={Link}
                                to={'/referral-program/withdrawals'}
                                value={'withdrawals'}
                                label="Withdrawals"
                                sx={styles.TabsLink}
                            />
                            <Tab
                                component={Link}
                                to={'/referral-program/commission-structure'}
                                value={'commission-structure'}
                                label="Commission Structure"
                                sx={styles.TabsLink}
                            />
                            <Tab
                                component={Link}
                                to={'/referral-program/marketing-content'}
                                value={'marketing-content'}
                                label="Marketing Content"
                                sx={styles.TabsLink}
                            />
                        </TabList>
                    </Box>
                    <TabPanel value={'main'} sx={styles.TabsPanel}>
                        <Main />
                    </TabPanel>
                    <TabPanel value={'referrals'} sx={styles.TabsPanel}>
                        <Referrals />
                    </TabPanel>
                    <TabPanel value={'withdrawals'} sx={styles.TabsPanel}>
                        <Withdrawals />
                    </TabPanel>
                    <TabPanel value={'commission-structure'} sx={styles.TabsPanel}>
                        <CommissionStructure />
                    </TabPanel>
                    <TabPanel value={'marketing-content'} sx={styles.TabsPanel}>
                        <MarketingContent />
                    </TabPanel>
                </Grid>
            </TabContext>
        </>
    );
}

export default Referral;
