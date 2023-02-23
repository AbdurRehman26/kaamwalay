import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
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
import { SafeSquareOutline } from '@shared/components/icons/SafeSquareOutline';
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
    const drawerState = useAppSelector((state) => state.page.drawerOpened);
    const cardsManagementState = useAppSelector((state) => state.page.cardsManagementSelected);
    const [open, setOpen] = useState(false);
    const [openReferral, setOpenReferral] = useState(false);

    const classes = useStyles({ drawerState, cardsManagementState, open });

    const handleClick = () => {
        setOpen(!open);
    };

    const handleReferralClick = () => {
        setOpenReferral(!openReferral);
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
                        <LayoutSidebarItem title={'Cards'} href={'/cards'} cardsManagementStyle={true} />
                        <LayoutSidebarItem title={'Rarities'} href={'/rarities'} cardsManagementStyle={true} />
                        <LayoutSidebarItem title={'Surfaces'} href={'/surfaces'} cardsManagementStyle={true} />
                    </List>
                </Collapse>
                <ListItemButton onClick={handleReferralClick} className={classes.cardManagementButton}>
                    <CampaignOutlined className={classes.iconHolder}>
                        <StyleIcon sx={{ color: cardsManagementState ? '#20BFB8' : 'rgba(0, 0, 0, 0.54)' }} />
                    </CampaignOutlined>
                    <ListItemText primary="Referral Program" className={classes.title} />
                    {openReferral ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openReferral} timeout="auto" className={classes.collapse}>
                    <List component="div" className={classes.list}>
                        <LayoutSidebarItem title={'Referral Payouts'} href={'/referral-program'} />
                    </List>
                </Collapse>
                <LayoutSidebarItem icon={ReceiptIcon} title={'Ledger'} href={'/ledger'} comingSoon />
            </List>
        </Drawer>
    );
}

export default LayoutSidebar;
