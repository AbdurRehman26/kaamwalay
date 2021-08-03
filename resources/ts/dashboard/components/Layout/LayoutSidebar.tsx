import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';
import StyleIcon from '@material-ui/icons/Style';
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import UserAvatar from '../../assets/dummyLargeAvatar.png';
import SideBarMenuItem from '../SidebarMenuItem';

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
    const location = useLocation();

    return (
        <Paper variant={'outlined'} className={classes.root}>
            <Grid container direction={'row'} alignItems={'center'} className={classes.header}>
                <div className={classes.headerAvatarHolder}>
                    <Avatar src={UserAvatar} className={classes.headerAvatar} />
                </div>
                <div className={classes.headerInfoHolder}>
                    <Typography variant={'h6'}>James Smith</Typography>
                    <Button variant={'text'} color={'primary'} className={classes.headerSignOut}>
                        Sign Out
                    </Button>
                </div>
            </Grid>

            <div>
                <SideBarMenuItem
                    icon={<AllInboxIcon htmlColor={'#000000'} />}
                    active={location.pathname === '/submissions'}
                    activeIcon={<AllInboxIcon htmlColor={'#20BFB8'} />}
                    title={'Submissions'}
                    link={'/submissions'}
                />
                <SideBarMenuItem
                    icon={<StyleIcon htmlColor={'#000000'} />}
                    activeIcon={<StyleIcon htmlColor={'#20BFB8'} />}
                    title={'Your Cards'}
                    active={location.pathname === '/your-cards'}
                    link={'/your-cards'}
                />
                <SideBarMenuItem
                    icon={<AccountCircleOutlinedIcon htmlColor={'#000000'} />}
                    activeIcon={<AccountCircleOutlinedIcon htmlColor={'#20BFB8'} />}
                    title={'Profile'}
                    active={location.pathname === '/profile'}
                    link={'/profile'}
                />
                <SideBarMenuItem
                    icon={<PaymentOutlinedIcon htmlColor={'#000000'} />}
                    activeIcon={<PaymentOutlinedIcon htmlColor={'#20BFB8'} />}
                    title={'Saved Credit Cards'}
                    active={location.pathname === '/saved-credit-cards'}
                    link={'/saved-credit-cards'}
                />
                <SideBarMenuItem
                    icon={<HomeOutlinedIcon htmlColor={'#000000'} />}
                    activeIcon={<HomeOutlinedIcon htmlColor={'#20BFB8'} />}
                    title={'Address Book'}
                    active={location.pathname === '/address-book'}
                    link={'/address-book'}
                />
            </div>
        </Paper>
    );
}

export default LayoutSidebar;
