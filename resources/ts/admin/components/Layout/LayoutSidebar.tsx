import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Face from '@mui/icons-material/Face';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SellIcon from '@mui/icons-material/Sell';
import StyleIcon from '@mui/icons-material/Style';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SafeSquareOutline } from '@shared/components/icons/SafeSquareOutline';
import { setCardsManagementState, setReferralProgramState } from '@shared/redux/slices/pageSlice';
import { useAppSelector } from '@admin/redux/hooks';
import LayoutSidebarItem from './LayoutSidebarItem';

const useStyles = makeStyles(
    () => ({
        root: {
            overflow: 'hidden',
            borderLeft: '4px solid transparent',
        },
        list: {
            paddingTop: '0px',
        },
        collapse: {
            background: '#F9F9F9',
        },
        cardManagementButton: {
            borderLeft: ({ cardsManagementState }: any) =>
                cardsManagementState ? '4px solid #20BFB8' : '4px solid transparent',
            background: ({ open }: any) => (open ? '#F9F9F9' : '#fff'),
        },
        referralProgramButton: {
            borderLeft: ({ referralProgramState }: any) =>
                referralProgramState ? '4px solid #20BFB8' : '4px solid transparent',
            background: ({ open }: any) => (open ? '#F9F9F9' : '#fff'),
        },
        drawerPaper: ({ drawerState }: Record<string, any>) => ({
            width: drawerState ? 260 : 0,
            position: 'relative',
            transition:
                'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms !important',
        }),
        title: {
            marginBottom: 3,
        },
        iconHolder: {
            minWidth: 42,
        },
    }),
    {
        name: 'LayoutSidebar',
    },
);

function LayoutSidebar() {
    const dispatch = useDispatch();
    const drawerState = useAppSelector((state) => state.page.drawerOpened);
    const cardsManagementState = useAppSelector((state) => state.page.cardsManagementSelected);
    const referralProgramState = useAppSelector((state) => state.page.referralProgramSelected);
    const [open, setOpen] = useState(false);
    const [referralProgramOpen, setReferralProgramOpen] = useState(false);

    const classes = useStyles({ drawerState, cardsManagementState, referralProgramState, open });

    const handleClick = () => {
        setOpen(!open);
    };

    const handleReferralProgramClick = () => {
        setReferralProgramOpen(!referralProgramOpen);
    };

    const handleCardsManagementOpened = () => {
        dispatch(setReferralProgramState(false));
        dispatch(setCardsManagementState(true));
    };

    const handleCardsManagementClosed = () => {
        dispatch(setCardsManagementState(false));
    };

    const handleReferralProgramOpened = () => {
        dispatch(setCardsManagementState(false));
        dispatch(setReferralProgramState(true));
    };

    const handleReferralProgramClosed = () => {
        dispatch(setReferralProgramState(false));
    };

    return (
        <Drawer
            open={drawerState}
            variant={'persistent'}
            className={classes.root}
            classes={{ paper: classes.drawerPaper }}
        >
            <List>
                <LayoutSidebarItem icon={AllInboxIcon} title={'Submissions'} href={'/submissions'} />
                <LayoutSidebarItem icon={SellIcon} title={'Promo Codes'} href={'/promo-codes'} />
                <LayoutSidebarItem icon={AccountCircleOutlinedIcon} title={'Customers'} href={'/customers'} />
                <LayoutSidebarItem icon={Face} title={'Sales Reps'} href={'/salesreps'} />
                <LayoutSidebarItem
                    icon={SafeSquareOutline}
                    title={'Vault Storage'}
                    href={'/vault-storage'}
                    comingSoon
                />
                <ListItemButton onClick={handleClick} className={classes.cardManagementButton}>
                    <ListItemIcon className={classes.iconHolder}>
                        <StyleIcon sx={{ color: cardsManagementState ? '#20BFB8' : 'rgba(0, 0, 0, 0.54)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Cards Management" className={classes.title} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" className={classes.collapse}>
                    <List component="div" className={classes.list}>
                        <LayoutSidebarItem
                            title={'Cards'}
                            href={'/cards'}
                            collapseStyle={true}
                            collapseOpenedAction={handleCardsManagementOpened}
                            collapseClosedAction={handleCardsManagementClosed}
                        />
                        <LayoutSidebarItem
                            title={'Rarities'}
                            href={'/rarities'}
                            collapseStyle={true}
                            collapseOpenedAction={handleCardsManagementOpened}
                            collapseClosedAction={handleCardsManagementClosed}
                        />
                        <LayoutSidebarItem
                            title={'Surfaces'}
                            href={'/surfaces'}
                            collapseStyle={true}
                            collapseOpenedAction={handleCardsManagementOpened}
                            collapseClosedAction={handleCardsManagementClosed}
                        />
                    </List>
                </Collapse>
                <ListItemButton onClick={handleReferralProgramClick} className={classes.referralProgramButton}>
                    <ListItemIcon className={classes.iconHolder}>
                        <CampaignOutlined sx={{ color: referralProgramState ? '#20BFB8' : 'rgba(0, 0, 0, 0.54)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Referral Program" className={classes.title} />
                    {referralProgramOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={referralProgramOpen} timeout="auto" className={classes.collapse}>
                    <List component="div" className={classes.list}>
                        <LayoutSidebarItem
                            title={'Overview'}
                            href={'/referral-program/overview'}
                            collapseStyle={true}
                            collapseOpenedAction={handleReferralProgramOpened}
                            collapseClosedAction={handleReferralProgramClosed}
                        />
                        <LayoutSidebarItem
                            title={'Referrers'}
                            href={'/referral-program/referrers'}
                            collapseStyle={true}
                            collapseOpenedAction={handleReferralProgramOpened}
                            collapseClosedAction={handleReferralProgramClosed}
                        />
                        <LayoutSidebarItem
                            title={'Referees'}
                            href={'/referral-program/referees'}
                            collapseStyle={true}
                            collapseOpenedAction={handleReferralProgramOpened}
                            collapseClosedAction={handleReferralProgramClosed}
                        />
                        <LayoutSidebarItem
                            title={'Referral Orders'}
                            href={'/referral-program/submissions'}
                            collapseStyle={true}
                            collapseOpenedAction={handleReferralProgramOpened}
                            collapseClosedAction={handleReferralProgramClosed}
                        />
                        <LayoutSidebarItem
                            title={'Payouts'}
                            href={'/referral-program/payouts'}
                            collapseStyle={true}
                            collapseOpenedAction={handleReferralProgramOpened}
                            collapseClosedAction={handleReferralProgramClosed}
                        />
                    </List>
                </Collapse>
                <LayoutSidebarItem icon={ReceiptIcon} title={'Ledger'} href={'/ledger'} comingSoon />
                <LayoutSidebarItem
                    icon={ArchiveOutlinedIcon}
                    title={'Abandoned'}
                    href={'/abandoned/submissions/all/list'}
                />
            </List>
        </Drawer>
    );
}

export default LayoutSidebar;
