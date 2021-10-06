import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import StyleIcon from '@mui/icons-material/Style';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import UserAvatar from '@shared/assets/dummyAvatar.svg';
import { useAuth } from '@shared/hooks/useAuth';
import LayoutSidebarItem from './LayoutSidebarItem';

const useStyles = makeStyles(
    {
        root: {
            width: '100%',
            overflow: 'hidden',
        },

        header: {
            flexWrap: 'nowrap',
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
            maxWidth: 'calc(100% - 100px)',
        },
        headerUserName: {
            width: '100%',
        },
    },
    {
        name: 'LayoutSidebar',
    },
);

function LayoutSidebar() {
    const classes = useStyles();
    const { logout, user } = useAuth();

    const userFullName = user.getFullName();

    return (
        <Paper variant={'outlined'} className={classes.root}>
            <Grid container direction={'row'} alignItems={'center'} className={classes.header}>
                <div className={classes.headerAvatarHolder}>
                    <Avatar src={UserAvatar} className={classes.headerAvatar} />
                </div>
                <div className={classes.headerInfoHolder}>
                    <Typography variant={'h6'} noWrap title={userFullName} className={classes.headerUserName}>
                        {userFullName}
                    </Typography>
                    <Link onClick={logout} variant={'body2'} color={'primary'} className={classes.headerSignOut}>
                        Sign Out
                    </Link>
                </div>
            </Grid>

            <List>
                <LayoutSidebarItem icon={AllInboxIcon} title={'Submissions'} href={'/submissions'} />
                <LayoutSidebarItem icon={StyleIcon} title={'Your Cards'} disabled href={'/cards'} />
                <LayoutSidebarItem icon={AccountCircleOutlinedIcon} disabled title={'Profile'} href={'/profile'} />
                <LayoutSidebarItem
                    exact
                    icon={PaymentOutlinedIcon}
                    title={'Saved Credit Cards'}
                    href={'/profile/payments'}
                    disabled
                />
                <LayoutSidebarItem
                    exact
                    icon={HomeOutlinedIcon}
                    disabled
                    title={'Address Book'}
                    href={'/profile/address'}
                />
            </List>
        </Paper>
    );
}

export default LayoutSidebar;
