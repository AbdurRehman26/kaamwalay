// TODO: Merge into a general component
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircleOutlined';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCardOutlined';
import FeedIcon from '@mui/icons-material/FeedOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import StyleIcon from '@mui/icons-material/StyleOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useLocation, useNavigate } from 'react-router-dom';
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
            margin: theme.spacing(1, 0),
        },
        listItemText: {
            fontWeight: 500,
            paddingLeft: theme.spacing(2),
            color: theme.palette.text.primary,
        },
        listItemAction: {
            fontWeight: 'normal',
            paddingLeft: theme.spacing(2),
        },
        activeItem: {
            backgroundColor: '#d2f2f1',
        },
        drawerPaper: {
            width: '100%',
            maxWidth: 300,
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
            maxWidth: 'calc(100% - 120px)',
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
    const location = useLocation();
    const navigate = useNavigate();
    const user$ = useAuth().user;

    function isItemActive(itemPath: string) {
        return location.pathname === itemPath;
    }

    function handleClose() {
        dispatch(setNavigationDrawerOpen(false));
    }

    function handleItemPress(path: string) {
        return () => {
            navigate(path);
            dispatch(setNavigationDrawerOpen(false));
        };
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
                    <Avatar src={user$?.profileImage ?? UserAvatar} className={classes.headerAvatar} />
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
                <ListItem selected={isItemActive('/submissions')} onClick={handleItemPress('/submissions')} button>
                    <StyledListItemIcon>
                        <InventoryIcon />
                    </StyledListItemIcon>
                    <ListItemText
                        primary={'Submissions'}
                        primaryTypographyProps={{ className: classes.listItemText }}
                    />
                </ListItem>
                <ListItem selected={isItemActive('/cards')} onClick={handleItemPress('/cards')} button>
                    <StyledListItemIcon>
                        <StyleIcon />
                    </StyledListItemIcon>
                    <ListItemText primary={'Your Cards'} primaryTypographyProps={{ className: classes.listItemText }} />
                </ListItem>
                <ListItem selected={isItemActive('/wallet')} onClick={handleItemPress('/wallet')} button>
                    <StyledListItemIcon>
                        <AccountBalanceWalletOutlinedIcon />
                    </StyledListItemIcon>
                    <ListItemText primary={'Wallet'} primaryTypographyProps={{ className: classes.listItemText }} />
                </ListItem>
                <ListItem selected={isItemActive('/profile')} onClick={handleItemPress('/profile')} button>
                    <StyledListItemIcon>
                        <AccountCircleIcon />
                    </StyledListItemIcon>
                    <ListItemText primary={'Profile'} primaryTypographyProps={{ className: classes.listItemText }} />
                </ListItem>
                <ListItem selected={isItemActive('/payment-cards')} onClick={handleItemPress('/payment-cards')} button>
                    <StyledListItemIcon>
                        <CreditCardIcon />
                    </StyledListItemIcon>
                    <ListItemText
                        primary={'Saved Credit Cards'}
                        primaryTypographyProps={{ className: classes.listItemText }}
                    />
                </ListItem>
                <ListItem selected={isItemActive('/address-book')} onClick={handleItemPress('/address-book')} button>
                    <StyledListItemIcon>
                        <HomeIcon />
                    </StyledListItemIcon>
                    <ListItemText
                        primary={'Address Book'}
                        primaryTypographyProps={{ className: classes.listItemText }}
                    />
                </ListItem>
                <ListItem
                    selected={isItemActive('/referral-program')}
                    onClick={handleItemPress('/referral-program/main')}
                    button
                >
                    <StyledListItemIcon>
                        <CampaignOutlinedIcon />
                    </StyledListItemIcon>
                    <ListItemText
                        primary={'Partner Program'}
                        primaryTypographyProps={{ className: classes.listItemText }}
                    />
                </ListItem>

                <Divider className={classes.divider} />

                <ListItem component={'a'} href={'/feed'}>
                    <StyledListItemIcon>
                        <FeedIcon />
                    </StyledListItemIcon>
                    <ListItemText primary={'Live Feed'} primaryTypographyProps={{ className: classes.listItemText }} />
                </ListItem>
                <ListItem component={'a'} href={'/pop'}>
                    <StyledListItemIcon>
                        <AssessmentIcon />
                    </StyledListItemIcon>
                    <ListItemText primary={'POP Report'} primaryTypographyProps={{ className: classes.listItemText }} />
                </ListItem>
                <ListItem component={'a'} href={'/partners'}>
                    <StyledListItemIcon>
                        <CampaignOutlinedIcon />
                    </StyledListItemIcon>
                    <ListItemText primary={'Partners'} primaryTypographyProps={{ className: classes.listItemText }} />
                </ListItem>
            </List>
        </Drawer>
    );
}

const StyledListItemIcon = styled(ListItemIcon)({
    minWidth: 24,
});
