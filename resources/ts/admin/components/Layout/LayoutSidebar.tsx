import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import StyleIcon from '@material-ui/icons/Style';
import React from 'react';

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

        header: {
            backgroundColor: '#f9f9f9',
            padding: '16px 0',
            borderBottom: '1px solid #e0e0e0',
        },

        headerSignOut: {
            marginTop: 6,
            fontWeight: 500,
            textTransform: 'uppercase',
            cursor: 'pointer',
        },

        headerAvatarHolder: {
            display: 'inline-flex',
            padding: '0 14px',
        },
        headerAvatar: {
            border: '2px solid #e4edff',
            width: 72,
            height: 72,
        },

        headerInfoHolder: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexGrow: 1,
        },
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
            keepMounted
            variant={'persistent'}
            className={classes.root}
            classes={{ paper: classes.drawerPaper }}
        >
            <List>
                <LayoutSidebarItem icon={AllInboxIcon} title={'Submissions'} href={'/submissions'} />
                <LayoutSidebarItem icon={StyleIcon} title={'Cards'} href={'/cards'} />
                <LayoutSidebarItem icon={AccountCircleOutlinedIcon} title={'Customers'} href={'/customers'} />
                <LayoutSidebarItem icon={AccountCircleOutlinedIcon} title={'Ledger'} href={'/ledger'} />
            </List>
        </Drawer>
    );
}

export default LayoutSidebar;
