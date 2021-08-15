import { ListItemSecondaryAction } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { transparentize } from 'polished';
import React, { ElementType, useMemo } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { cx } from '@shared/lib/utils/cx';
import font from '@shared/styles/font.module.scss';

type SidebarMenuItemProps = {
    icon: ElementType;
    title: string;
    href: string;
    exact?: boolean;
    disabled?: boolean;
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
        chip: {
            opacity: '1 !important',
        },
    }),
    {
        name: 'SidebarMenuItem',
    },
);

function LayoutSidebarItem(props: SidebarMenuItemProps) {
    const { icon: Icon, title, href, exact, disabled } = props;

    const location = useLocation();
    const classes = useStyles({ disabled });

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
        <ListItem selected={isActive} button component={Link} to={!disabled ? href : '#'} classes={itemClasses}>
            <ListItemIcon className={classes.iconHolder}>
                <Icon className={classes.icon} />
            </ListItemIcon>
            <ListItemText
                primary={title}
                className={classes.title}
                primaryTypographyProps={{
                    className: cx({
                        [font.fontWeightMedium]: isActive,
                    }),
                }}
            />
            {disabled ? (
                <ListItemSecondaryAction>
                    <Chip size="small" label="Coming Soon" color={'secondary'} />
                </ListItemSecondaryAction>
            ) : null}
        </ListItem>
    );
}

export default LayoutSidebarItem;
