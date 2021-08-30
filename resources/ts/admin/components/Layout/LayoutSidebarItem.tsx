import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { transparentize } from 'polished';
import React, { ElementType, useMemo } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

type SidebarMenuItemProps = {
    icon: ElementType;
    title: string;
    href: string;
    exact?: boolean;
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
            '&& $title$title': {
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
    }),
    {
        name: 'SidebarMenuItem',
    },
);

function LayoutSidebarItem(props: SidebarMenuItemProps) {
    const { icon: Icon, title, href, exact } = props;

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
        () =>
            !!matchPath(location.pathname, {
                path: href,
                exact,
            }),
        [location.pathname, href, exact],
    );

    return (
        <ListItem selected={isActive} button component={Link} to={href} classes={itemClasses}>
            <ListItemIcon className={classes.iconHolder}>
                <Icon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary={title} className={classes.title} />
        </ListItem>
    );
}

export default LayoutSidebarItem;
