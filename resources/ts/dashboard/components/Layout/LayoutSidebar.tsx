import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';
import StyleIcon from '@material-ui/icons/Style';
import React from 'react';

import UserAvatar from '@shared/assets/dummyLargeAvatar.png';
import { useAuth } from '@shared/hooks/useAuth';

import LayoutSidebarItem from './LayoutSidebarItem';

const useStyles = makeStyles(
    {
        root: {
            width: '100%',
            overflow: 'hidden',
        },

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
    const classes = useStyles();
    const { logout, user } = useAuth();

    return (
        <Paper variant={'outlined'} className={classes.root}>
            <Grid container direction={'row'} alignItems={'center'} className={classes.header}>
                <div className={classes.headerAvatarHolder}>
                    <Avatar src={UserAvatar} className={classes.headerAvatar} />
                </div>
                <div className={classes.headerInfoHolder}>
                    <Typography variant={'h6'}>{user.getFullName()}</Typography>
                    <Link onClick={logout} variant={'body2'} color={'primary'} className={classes.headerSignOut}>
                        Sign Out
                    </Link>
                </div>
            </Grid>

            <List>
                <LayoutSidebarItem icon={AllInboxIcon} title={'Submissions'} href={'/submissions'} />
                <LayoutSidebarItem icon={StyleIcon} title={'Your Cards'} href={'/cards'} />
                <LayoutSidebarItem icon={AccountCircleOutlinedIcon} title={'Profile'} href={'/profile'} />
                <LayoutSidebarItem
                    exact
                    icon={PaymentOutlinedIcon}
                    title={'Saved Credit Cards'}
                    href={'/profile/payments'}
                />
                <LayoutSidebarItem exact icon={HomeOutlinedIcon} title={'Address Book'} href={'/profile/address'} />
            </List>
        </Paper>
    );
}

export default LayoutSidebar;
