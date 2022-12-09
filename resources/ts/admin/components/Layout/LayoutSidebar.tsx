import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
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
import { useSelector } from 'react-redux';
import { SafeSquareOutline } from '@shared/components/icons/SafeSquareOutline';
import { useAppSelector } from '@admin/redux/hooks';
import { RootState } from '../../redux/store';
import LayoutSidebarItem from './LayoutSidebarItem';

const useStyles = makeStyles(
    () => ({
        root: {
            overflow: 'hidden',
            borderLeft: '4px solid transparent',
        },
        drawerPaper: ({ drawerState }: Record<string, any>) => ({
            width: drawerState ? 240 : 0,
            position: 'relative',
            transition:
                'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms !important',
        }),
        title: {
            marginBottom: 3,
            '& .MuiListItemText-primary': {
                fontSize: '14px !important',
                lineHeight: '20px !important',
                letterSpacing: '0.2px !important',
            },
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
    const classes = useStyles({ drawerState });
    const cardsManagementState = useSelector((state: RootState) => state.page.cardsManagementSelected);
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
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
                <ListItemButton
                    onClick={handleClick}
                    sx={{ borderLeft: cardsManagementState ? '4px solid #20BFB8' : 'none' }}
                >
                    <ListItemIcon className={classes.iconHolder}>
                        <StyleIcon sx={{ color: cardsManagementState ? '#20BFB8' : 'rgba(0, 0, 0, 0.54)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Cards Management" className={classes.title} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto">
                    <List component="div" sx={{ paddingTop: '0px' }}>
                        <LayoutSidebarItem title={'Cards'} href={'/cards'} cardsManagementStyle={true} />
                        <LayoutSidebarItem title={'Rarities'} href={'/rarities'} cardsManagementStyle={true} />
                        <LayoutSidebarItem title={'Surfaces'} href={'/surfaces'} cardsManagementStyle={true} />
                    </List>
                </Collapse>
                <LayoutSidebarItem icon={ReceiptIcon} title={'Ledger'} href={'/ledger'} comingSoon />
            </List>
        </Drawer>
    );
}

export default LayoutSidebar;
