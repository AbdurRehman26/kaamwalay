import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import { transparentize } from 'polished';
import React, { ElementType, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { setCardsManagementState } from '@shared/redux/slices/pageSlice';

type SidebarMenuItemProps = {
    icon?: ElementType;
    title: string;
    href: string;
    exact?: boolean;
    comingSoon?: boolean;
    cardsManagementStyle?: boolean;
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
                fontSize: '14px !important',
                lineHeight: '20px !important',
                letterSpacing: '0.2px !important',
            },
        },
        notSelected: {
            backgroundColor: `${transparentize(0.8, theme.palette.primary.main)} !important`,

            '& $icon, & $title': {
                color: theme.palette.primary.main,
            },
            '& $title .MuiListItemText-primary': {
                fontWeight: '500 !important',
                fontSize: '14px !important',
                lineHeight: '20px !important',
                letterSpacing: '0.2px !important',
            },
        },
        icon: {},
        title: {
            marginBottom: 3,
            '& .MuiListItemText-primary': {
                fontSize: '14px !important',
                lineHeight: '20px !important',
                letterSpacing: '0.2px !important',
            },
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
    const { icon: Icon, title, href, exact, comingSoon, cardsManagementStyle } = props;
    const dispatch = useDispatch();
    const location = useLocation();
    const classes = useStyles();

    useEffect(() => {
        if (
            itemClasses.selected === classes.notSelected &&
            !!matchPath({ path: exact ? href : `${href}/*` }, location.pathname)
        ) {
            dispatch(setCardsManagementState(true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const itemClasses = useMemo(
        () => ({
            root: classes.root,
            selected: cardsManagementStyle ? classes.notSelected : classes.selected,
        }),
        [classes.root, classes.selected, classes.notSelected, cardsManagementStyle],
    );

    const isActive = useMemo(
        () => !!matchPath({ path: exact ? href : `${href}/*` }, location.pathname),
        [location.pathname, exact, href],
    );

    const rest = !comingSoon
        ? {
              component: Link,
              to: href,
          }
        : {};

    return (
        <ListItemButton
            selected={isActive}
            {...(rest as any)}
            classes={itemClasses}
            onClick={() =>
                cardsManagementStyle
                    ? dispatch(setCardsManagementState(true))
                    : dispatch(setCardsManagementState(false))
            }
        >
            <ListItemIcon className={classes.iconHolder}>
                {Icon ? <Icon className={classes.icon} /> : null}
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
