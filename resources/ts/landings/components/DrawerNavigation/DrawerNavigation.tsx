// TODO: Merge into a general component
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FeedIcon from '@mui/icons-material/FeedOutlined';
import UploadIcon from '@mui/icons-material/FileUploadOutlined';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/PersonOutline';
import StyleIcon from '@mui/icons-material/StyleOutlined';
// import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useState } from 'react';
import logo from '@shared/assets/logo.svg';
import { AuthDialog } from '@shared/components/AuthDialog';
import { useAuth } from '@shared/hooks/useAuth';
import { cx } from '@shared/lib/utils/cx';
import SubmissionButton from '../SubmissionButton/SubmissionButton';

const useStyles = makeStyles(
    (theme) => ({
        toggleButton: {
            position: 'absolute',
            top: 10,
            left: 10,
        },
        button: {
            margin: theme.spacing(1.5, 2, 0),
            borderRadius: 20,
            minWidth: 120,
            width: `calc(100% - ${theme.spacing(4)})`,
        },
        buttonBackground: {
            backgroundColor: theme.palette.primary.main,
        },
        divider: {
            margin: theme.spacing(1, 0),
        },
        list: {
            marginTop: 0,
            paddingTop: 0,
        },
        listItemText: {
            fontWeight: 500,
            paddingLeft: theme.spacing(2),
            fontSize: 14,
        },
        drawerPaper: {
            minWidth: 300,
        },
        brand: {
            display: 'flex',
            '& img': {
                height: 34,
                marginLeft: theme.spacing(0.5),
            },
        },
    }),
    { name: 'DrawerNavigation' },
);

export function DrawerNavigation() {
    const classes = useStyles();
    const { authenticated, logout, authDialogProps, openAuthDialog } = useAuth();
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
                <Box display={'flex'} alignItems={'center'} width={'100%'} paddingX={2} pt={2} pb={1}>
                    <IconButton size={'medium'} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>

                    <Grid>
                        <a href="/" className={classes.brand}>
                            <img src={logo} alt="Robograding" />
                        </a>
                    </Grid>
                </Box>
                <Divider className={classes.divider} />
                <List className={classes.list}>
                    {authenticated && (
                        <>
                            <ListItem button onClick={handleItemPress('/dashboard/submissions')}>
                                <StyledListItemIcon>
                                    <InventoryIcon />
                                </StyledListItemIcon>
                                <ListItemText
                                    primary={'Submissions'}
                                    primaryTypographyProps={{ className: classes.listItemText }}
                                />
                            </ListItem>
                            <ListItem button onClick={handleItemPress('/dashboard/cards')}>
                                <StyledListItemIcon>
                                    <StyleIcon />
                                </StyledListItemIcon>
                                <ListItemText
                                    primary={'Your Cards'}
                                    primaryTypographyProps={{ className: classes.listItemText }}
                                />
                            </ListItem>

                            {/* <ListItem button onClick={handleItemPress('/dashboard')}> */}
                            {/*    <ListItemText */}
                            {/*        primary={'Profile'} */}
                            {/*        primaryTypographyProps={{ className: classes.listItemText }} */}
                            {/*    /> */}
                            {/* </ListItem> */}
                            {/* <ListItem button onClick={handleItemPress('/dashboard')}> */}
                            {/*    <ListItemText */}
                            {/*        primary={'Saved Credit Cards'} */}
                            {/*        primaryTypographyProps={{ className: classes.listItemText }} */}
                            {/*    /> */}
                            {/* </ListItem> */}
                            {/* <ListItem button onClick={handleItemPress('/dashboard')}> */}
                            {/*    <ListItemText */}
                            {/*        primary={'Address Book'} */}
                            {/*        primaryTypographyProps={{ className: classes.listItemText }} */}
                            {/*    /> */}
                            {/* </ListItem> */}
                            <Divider className={classes.divider} />
                        </>
                    )}
                    <ListItem button onClick={handleItemPress('/feed')}>
                        <StyledListItemIcon>
                            <FeedIcon />
                        </StyledListItemIcon>
                        <ListItemText
                            primary={'Live Feed'}
                            primaryTypographyProps={{ className: classes.listItemText }}
                        />
                    </ListItem>
                    <ListItem button onClick={handleItemPress('/pop')}>
                        <StyledListItemIcon>
                            <AssessmentIcon />
                        </StyledListItemIcon>
                        <ListItemText
                            primary={'POP Report'}
                            primaryTypographyProps={{ className: classes.listItemText }}
                        />
                    </ListItem>
                    <ListItem onClick={handleItemPress('/partners')}>
                        <StyledListItemIcon>
                            <CampaignOutlinedIcon />
                        </StyledListItemIcon>
                        <ListItemText
                            primary={'Partners'}
                            primaryTypographyProps={{ className: classes.listItemText }}
                        />
                    </ListItem>
                    {/* <ListItem onClick={handleItemPress('/authentication')}>*/}
                    {/*    <StyledListItemIcon>*/}
                    {/*        <VerifiedUserOutlinedIcon />*/}
                    {/*    </StyledListItemIcon>*/}
                    {/*    <ListItemText*/}
                    {/*        primary={'Authentication'}*/}
                    {/*        primaryTypographyProps={{ className: classes.listItemText }}*/}
                    {/*    />*/}
                    {/* </ListItem>*/}

                    <Divider className={classes.divider} />

                    <Grid container direction={'column'} alignItems={'center'} justifyContent={'center'}>
                        <SubmissionButton
                            variant={'contained'}
                            color={'primary'}
                            className={cx(classes.button, classes.buttonBackground)}
                            startIcon={<UploadIcon />}
                            fullWidth
                            disableElevation
                        >
                            Submit Cards
                        </SubmissionButton>

                        {!authenticated ? (
                            <Button
                                onClick={openAuthDialog}
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
            <AuthDialog {...authDialogProps} />
        </>
    );
}

export default DrawerNavigation;

const StyledListItemIcon = styled(ListItemIcon)({
    minWidth: 24,
});
