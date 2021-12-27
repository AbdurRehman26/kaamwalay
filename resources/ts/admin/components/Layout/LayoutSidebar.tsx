import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StyleIcon from '@mui/icons-material/Style';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useAppSelector } from '@admin/redux/hooks';
import LayoutSidebarItem from './LayoutSidebarItem';
import SellIcon from '@mui/icons-material/Sell';

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
                <LayoutSidebarItem icon={StyleIcon} title={'Cards'} href={'/cards'} comingSoon />
                <LayoutSidebarItem
                    icon={AccountCircleOutlinedIcon}
                    title={'Customers'}
                    href={'/customers'}
                    comingSoon
                />
                <LayoutSidebarItem icon={ReceiptIcon} title={'Ledger'} href={'/ledger'} comingSoon />
            </List>
        </Drawer>
    );
}

export default LayoutSidebar;
