import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useState } from 'react';
// import { useHistory } from 'react-router-dom';
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
    // const history = useHistory();

    const handleOpen = useCallback(() => setOpen(true), [setOpen]);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const handleLogout = useCallback(async () => {
        await logout();
        handleClose();
    }, [handleClose, logout]);

    function handleItemPress(path: string) {
        window.location.replace(path);
        // dispatch(setNavigationDrawerOpen(false));
    }

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
                    <ListItem button onClick={() => handleItemPress('/feed')}>
                        <ListItemText
                            primary={'Live Feed'}
                            primaryTypographyProps={{ className: classes.listItemText }}
                        />
                    </ListItem>
                    <ListItem button onClick={() => handleItemPress('/pop')}>
                        <ListItemText
                            primary={'POP Report'}
                            primaryTypographyProps={{ className: classes.listItemText }}
                        />
                    </ListItem>
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
