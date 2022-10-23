import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import SellIcon from '@mui/icons-material/Sell';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import makeStyles from '@mui/styles/makeStyles';
import { transparentize } from 'polished';
import { useAppSelector } from '@admin/redux/hooks';
import LayoutSidebarItem from './LayoutSidebarItem';

const useStyles = makeStyles(
    (theme) => ({
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
        selected: {
            borderLeftColor: theme.palette.primary.main,
            backgroundColor: `${transparentize(0.8, theme.palette.primary.main)} !important`,

            '& $icon, & $title': {
                color: theme.palette.primary.main,
            },
            '& $title .MuiListItemText-primary': {
                fontWeight: '500 !important',
            },
        },
        title: {
            marginBottom: 3,
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

    return (
        <Drawer
            open={drawerState}
            variant={'persistent'}
            className={classes.root}
            classes={{ paper: classes.drawerPaper }}
        >
            <List>
                <LayoutSidebarItem icon={AllInboxIcon} title={'Dashboard'} href={'/'} />
                <LayoutSidebarItem icon={AllInboxIcon} title={'Submissions'} href={'/submissions'} comingSoon />
                <LayoutSidebarItem icon={SellIcon} title={'Promo Codes'} href={'/promo-codes'} comingSoon />
                <LayoutSidebarItem
                    icon={AccountCircleOutlinedIcon}
                    title={'Customers'}
                    href={'/customers'}
                    comingSoon
                />
            </List>
        </Drawer>
    );
}

export default LayoutSidebar;
