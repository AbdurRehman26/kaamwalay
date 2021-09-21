import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import { useCallback, useState } from 'react';
import { useAuth } from '@shared/hooks/useAuth';

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
        drawerPaper: {
            minWidth: 260,
        },
    }),
    { name: 'DrawerNavigation' },
);

export function DrawerNavigation() {
    const classes = useStyles();
    const { authenticated, logout } = useAuth();
    const [isOpen, setOpen] = useState(false);

    const handleOpen = useCallback(() => setOpen(true), [setOpen]);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const handleLogout = useCallback(async () => {
        await logout();
        handleClose();
    }, [handleClose, logout]);

    return (
        <>
            <IconButton color={'inherit'} size={'medium'} className={classes.toggleButton} onClick={handleOpen}>
                <MenuIcon color={'inherit'} />
            </IconButton>
            <Drawer anchor={'left'} open={isOpen} onClose={handleClose} classes={{ paper: classes.drawerPaper }}>
                <Box display={'flex'} width={'100%'} paddingX={2} paddingTop={2}>
                    <IconButton size={'medium'} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <List>
                    {/* {authenticated && (*/}
                    {/*    <ListItem button href={'/dashboard'}>*/}
                    {/*        <ListItemText*/}
                    {/*            primary={'Dashboard'}*/}
                    {/*            primaryTypographyProps={{ className: classes.listItemText }}*/}
                    {/*        />*/}
                    {/*    </ListItem>*/}
                    {/* )}*/}
                    {/* <ListItem button href={'/feed'}>*/}
                    {/*    <ListItemText primary={'Feed'} primaryTypographyProps={{ className: classes.listItemText }} />*/}
                    {/* </ListItem>*/}
                    {/* <ListItem button href={'/how-it-works'}>*/}
                    {/*    <ListItemText*/}
                    {/*        primary={'How It Works'}*/}
                    {/*        primaryTypographyProps={{ className: classes.listItemText }}*/}
                    {/*    />*/}
                    {/* </ListItem>*/}
                    {/* <ListItem button href={'/pricing'}>*/}
                    {/*    <ListItemText*/}
                    {/*        primary={'Pricing'}*/}
                    {/*        primaryTypographyProps={{ className: classes.listItemText }}*/}
                    {/*    />*/}
                    {/* </ListItem>*/}
                    {/* <ListItem button href={'/about-us'}>*/}
                    {/*    <ListItemText*/}
                    {/*        primary={'About Us'}*/}
                    {/*        primaryTypographyProps={{ className: classes.listItemText }}*/}
                    {/*    />*/}
                    {/* </ListItem>*/}
                    {/* <ListItem button href={'/faq'}>*/}
                    {/*    <ListItemText primary={'FAQ'} primaryTypographyProps={{ className: classes.listItemText }} />*/}
                    {/* </ListItem>*/}

                    {/* <Divider className={classes.divider} />*/}

                    {!authenticated ? (
                        <>
                            <ListItem dense>
                                <Button
                                    href={'/auth/sign-in'}
                                    variant={'outlined'}
                                    color={'primary'}
                                    className={classes.button}
                                >
                                    Log In
                                </Button>
                                <Button
                                    href={'/auth/sign-up'}
                                    variant={'contained'}
                                    color={'primary'}
                                    className={classes.button}
                                >
                                    Sign Up
                                </Button>
                            </ListItem>
                        </>
                    ) : (
                        <ListItem button onClick={handleLogout}>
                            <ListItemText
                                primary={'Logout'}
                                primaryTypographyProps={{ className: classes.listItemText }}
                            />
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </>
    );
}

export default DrawerNavigation;
