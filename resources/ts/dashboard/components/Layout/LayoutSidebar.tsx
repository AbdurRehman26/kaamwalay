import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';
import StyleIcon from '@material-ui/icons/Style';
import React from 'react';
import { useLocation } from 'react-router-dom';

import UserAvatar from '../../assets/dummyLargeAvatar.png';
import SideBarMenuItem from '../SidebarMenuItem';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    userDetailsContainer: {
        width: '100%',
        minHeight: '120px',
        backgroundColor: '#F9F9F9',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#e0e0e0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginLeft: '16px',
    },
    userDataContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '12px',
    },
    userName: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '30px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    signOutTextBtn: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.35px',
        color: '#20BFB8',
        marginTop: '6px',
        '&:hover': {
            cursor: 'pointer',
            color: '#23827d',
        },
    },
    menuItemsContainer: {
        width: '100%',
    },
});

function LayoutSidebar() {
    const classes = useStyles();
    const location = useLocation();

    return (
        <Paper variant={'outlined'} className={classes.root}>
            <Paper elevation={0} className={classes.userDetailsContainer}>
                <div className={classes.avatarContainer}>
                    <img src={UserAvatar} alt={'Your Avatar'} />
                </div>
                <div className={classes.userDataContainer}>
                    <Typography variant={'subtitle2'} className={classes.userName}>
                        James Smith
                    </Typography>
                    <Typography variant={'subtitle2'} className={classes.signOutTextBtn}>
                        Sign Out
                    </Typography>
                </div>
            </Paper>

            <div className={classes.menuItemsContainer}>
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
