import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import { transparentize } from 'polished';
import React, { ElementType, useMemo } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

type SidebarMenuItemProps = {
    icon: ElementType;
    title: string;
    href: string;
    exact?: boolean;
    comingSoon?: boolean;
};

const useStyles = makeStyles(
    (theme) => ({
        root: {
            borderLeft: '4px solid transparent',
        },
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
        icon: {},
        title: {
            marginBottom: 3,
        },
        iconHolder: {
            minWidth: 42,
        },
        chip: {
            position: 'relative',
            fontSize: 11,
            height: 18,
            top: -1,
            transformOrigin: 'right center',
            transform: 'scale(0.75)',
        },
    }),
    {
        name: 'SidebarMenuItem',
    },
);

function LayoutSidebarItem(props: SidebarMenuItemProps) {
    const { icon: Icon, title, href, exact, comingSoon } = props;

    const location = useLocation();
    const classes = useStyles();

    const itemClasses = useMemo(
        () => ({
            root: classes.root,
            selected: classes.selected,
        }),
        [classes.root, classes.selected],
    );

    const isActive = useMemo(
        () => !!matchPath({ path: exact ? href : `${href}/*` }, location.pathname),
        [location.pathname, exact, href],
    );

    const rest = !comingSoon
        ? {
              button: true,
              component: Link,
              to: href,
          }
        : {};

    return (
        <ListItemButton selected={isActive} {...(rest as any)} classes={itemClasses}>
            <ListItemIcon className={classes.iconHolder}>
                <Icon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary={title} className={classes.title} />
            {comingSoon ? (
                <ListItemSecondaryAction>
                    <Chip className={classes.chip} color={'secondary'} label={'Coming Soon'} size={'small'} />
                </ListItemSecondaryAction>
            ) : null}
        </ListItemButton>
    );
}

export default LayoutSidebarItem;
