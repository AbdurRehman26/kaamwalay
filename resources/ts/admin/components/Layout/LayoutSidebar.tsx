import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
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
import React from 'react';
import { SafeSquareOutline } from '@shared/components/icons/SafeSquareOutline';
import { useAppSelector } from '@admin/redux/hooks';
import LayoutSidebarItem from './LayoutSidebarItem';

const useStyles = makeStyles(
    {
        root: {
            overflow: 'hidden',
        },
        drawerPaper: ({ drawerState }: Record<string, any>) => ({
            width: drawerState ? 240 : 0,
            position: 'relative',
            transition:
                'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms !important',
        }),
    },
    {
        name: 'LayoutSidebar',
    },
);

function LayoutSidebar() {
    const drawerState = useAppSelector((state) => state.page.drawerOpened);
    const classes = useStyles({ drawerState });
    const [open, setOpen] = React.useState(false);

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
                <LayoutSidebarItem
                    icon={SafeSquareOutline}
                    title={'Vault Storage'}
                    href={'/vault-storage'}
                    comingSoon
                />
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <StyleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cards Management" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div">
                        <LayoutSidebarItem icon={StyleIcon} title={'Cards'} href={'/cards'} />
                        <LayoutSidebarItem icon={StyleIcon} title={'Rarities'} href={'/rarities'} />
                    </List>
                </Collapse>
                <LayoutSidebarItem icon={ReceiptIcon} title={'Ledger'} href={'/ledger'} comingSoon />
            </List>
        </Drawer>
    );
}

export default LayoutSidebar;
