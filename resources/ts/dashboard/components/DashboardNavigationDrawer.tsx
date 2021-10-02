import { ListItemSecondaryAction } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { useHistory } from 'react-router-dom';
import UserAvatar from '@shared/assets/dummyAvatar.svg';
import { useAuth } from '@shared/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setNavigationDrawerOpen } from '@dashboard/redux/slices/dashboardSlice';

const useStyles = makeStyles(
    (theme) => ({
        toggleButton: {
            position: 'absolute',
            top: 3,
            left: 0,
        },
        button: {
            margin: theme.spacing(0, 1),
            borderRadius: 20,
            minWidth: 120,
        },
        divider: {
            margin: theme.spacing(1, 2),
        },
        listItemText: {
            fontWeight: 500,
            paddingLeft: theme.spacing(2),
        },
        listItemAction: {
            fontWeight: 'normal',
            paddingLeft: theme.spacing(2),
        },
        activeItem: {
            backgroundColor: '#d2f2f1',
        },
        drawerPaper: {
            minWidth: 260,
        },
        header: {
            flexWrap: 'nowrap',
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
            width: 52,
            height: 52,
        },

        headerInfoHolder: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexGrow: 1,
            maxWidth: 'calc(100% - 100px)',
        },
        closeIconHolder: {
            position: 'absolute',
            top: '6px',
            right: '3px',
        },
        headerUserName: {
            width: '100%',
            fontSize: '16px',
        },
    }),
    { name: 'DrawerNavigation' },
);

export function DashboardNavigationDrawer() {
    const classes = useStyles();
    const isNavigationDrawerOpen = useAppSelector((state) => state.dashboardSlice.isNavigationDrawerOpen);
    const { logout, user } = useAuth();
    const dispatch = useAppDispatch();
    const history = useHistory();

    function isItemActive(itemPath: string) {
        return history.location.pathname === itemPath;
    }

    function handleClose() {
        dispatch(setNavigationDrawerOpen(false));
    }

    function handleItemPress(path: string) {
        history.push(path);
        dispatch(setNavigationDrawerOpen(false));
    }

    return (
        <Drawer
            anchor={'left'}
            open={isNavigationDrawerOpen}
            onClose={handleClose}
            classes={{ paper: classes.drawerPaper }}
        >
            <Grid container direction={'row'} alignItems={'center'} className={classes.header}>
                <div className={classes.headerAvatarHolder}>
                    <Avatar src={UserAvatar} className={classes.headerAvatar} />
                </div>
                <div className={classes.headerInfoHolder}>
                    <Typography variant={'h6'} noWrap className={classes.headerUserName}>
                        {user.getFullName()}
                    </Typography>
                    <Link onClick={logout} variant={'body2'} color={'primary'} className={classes.headerSignOut}>
                        Sign Out
                    </Link>
                </div>

                <div className={classes.closeIconHolder}>
                    <IconButton size={'medium'} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </Grid>
            <List>
                <ListItem
                    selected={isItemActive('/submissions')}
                    onClick={() => handleItemPress('/submissions')}
                    button
                >
                    <ListItemText
                        primary={'Submissions'}
                        primaryTypographyProps={{ className: classes.listItemText }}
                    />
                </ListItem>
                <ListItem selected={isItemActive('/cards')} button>
                    <ListItemText primary={'Your Cards'} primaryTypographyProps={{ className: classes.listItemText }} />
                    <ListItemSecondaryAction>
                        <Chip size="small" label="Soon" color={'secondary'} />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem selected={isItemActive('/profile')} button>
                    <ListItemText primary={'Profile'} primaryTypographyProps={{ className: classes.listItemText }} />
                    <ListItemSecondaryAction>
                        <Chip size="small" label="Soon" color={'secondary'} />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem selected={isItemActive('/profile/payments')} button>
                    <ListItemText
                        primary={'Saved Credit Cards'}
                        primaryTypographyProps={{ className: classes.listItemText }}
                    />
                    <ListItemSecondaryAction>
                        <Chip size="small" label="Soon" color={'secondary'} />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem selected={isItemActive('/profile/addresses')} button>
                    <ListItemText
                        primary={'Address Book'}
                        primaryTypographyProps={{ className: classes.listItemText }}
                    />
                    <ListItemSecondaryAction>
                        <Chip size="small" label="Soon" color={'secondary'} />
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </Drawer>
    );
}

export default DashboardNavigationDrawer;
