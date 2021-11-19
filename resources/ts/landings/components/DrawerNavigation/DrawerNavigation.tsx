import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useState } from 'react';
import { useAuth } from '@shared/hooks/useAuth';
import PersonIcon from '@mui/icons-material/PersonOutline';
import UploadIcon from '@mui/icons-material/FileUploadOutlined';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const useStyles = makeStyles(
    (theme) => ({
        toggleButton: {
            position: 'absolute',
            top: 7,
            left: 8,
        },
        button: {
            margin: theme.spacing(1.5, 2, 0),
            borderRadius: 20,
            minWidth: 120,
            width: `calc(100% - ${theme.spacing(4)})`,
        },
        divider: {
            margin: theme.spacing(1, 0),
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

    const handleItemPress = useCallback(
        (path: string) => () => {
            window.location.replace(path);
        },
        [],
    );

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
                    {authenticated && (
                        <ListItem button onClick={handleItemPress('/dashboard')}>
                            <ListItemText
                                primary={'Dashboard'}
                                primaryTypographyProps={{ className: classes.listItemText }}
                            />
                        </ListItem>
                    )}
                    <ListItem button onClick={handleItemPress('/feed')}>
                        <ListItemText
                            primary={'Live Feed'}
                            primaryTypographyProps={{ className: classes.listItemText }}
                        />
                    </ListItem>
                    <ListItem button onClick={handleItemPress('/pop')}>
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

                    <Divider className={classes.divider} />
                    <Grid container direction={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Button
                            href={'/dashboard/submissions/new'}
                            variant={'contained'}
                            color={'primary'}
                            className={classes.button}
                            startIcon={<UploadIcon />}
                            fullWidth
                            disableElevation
                        >
                            Submit Cards
                        </Button>

                        {!authenticated ? (
                            <Button
                                href={'/auth/sign-in'}
                                variant={'text'}
                                color={'inherit'}
                                className={classes.button}
                                startIcon={<PersonIcon />}
                                fullWidth
                            >
                                Log In
                            </Button>
                        ) : (
                            <Button
                                variant={'text'}
                                color={'inherit'}
                                className={classes.button}
                                onClick={handleLogout}
                                startIcon={<LogoutIcon />}
                                fullWidth
                            >
                                Sign out
                            </Button>
                        )}
                    </Grid>
                </List>
            </Drawer>
        </>
    );
}

export default DrawerNavigation;
