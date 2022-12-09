import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Face from '@mui/icons-material/Face';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SellIcon from '@mui/icons-material/Sell';
import StyleIcon from '@mui/icons-material/Style';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { transparentize } from 'polished';
import { useSelector } from 'react-redux';
import { SafeSquareOutline } from '@shared/components/icons/SafeSquareOutline';
import { useAppSelector } from '@admin/redux/hooks';
import { RootState } from '../../redux/store';
import LayoutSidebarItem from './LayoutSidebarItem';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            overflow: 'hidden',
            borderLeft: '4px solid transparent',
        },
        accordion: {
            boxShadow: 'none',
            position: 'static',
            '& .Mui-expanded': {
                background: '#F9F9F9',
            },
            '& .MuiAccordionSummary-gutters': {
                height: '48px !important',
                minHeight: '0px',
            },
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
    const cardsManagementState = useSelector((state: RootState) => state.page.cardsManagementSelected);

    return (
        <Drawer
            open={drawerState}
            variant={'persistent'}
            className={classes.root}
            classes={{ paper: classes.drawerPaper }}
        >
            <List>
                <LayoutSidebarItem icon={AllInboxIcon} title={'Submissions'} href={'/submissions'} />
                <LayoutSidebarItem icon={SellIcon} title={'Promo Codes'} href={'/promo-codes'} />
                <LayoutSidebarItem icon={AccountCircleOutlinedIcon} title={'Customers'} href={'/customers'} />
                <LayoutSidebarItem icon={Face} title={'Sales Reps'} href={'/salesreps'} />
                <LayoutSidebarItem
                    icon={SafeSquareOutline}
                    title={'Vault Storage'}
                    href={'/vault-storage'}
                    comingSoon
                />
                <Accordion className={classes.accordion}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ borderLeft: cardsManagementState ? '4px solid #20BFB8' : 'none' }}
                    >
                        <ListItemIcon className={classes.iconHolder}>
                            <StyleIcon sx={{ color: cardsManagementState ? '#20BFB8' : 'rgba(0, 0, 0, 0.54)' }} />
                        </ListItemIcon>
                        <Typography
                            className={classes.title}
                            sx={{
                                fontSize: '14px!important',
                                lineHeight: '20px',
                                letterSpacing: '0.2px',
                            }}
                        >
                            Cards Management
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ background: '#F9F9F9', padding: '0px' }}>
                        <List component="div" sx={{ paddingTop: '0px' }}>
                            <LayoutSidebarItem title={'Cards'} href={'/cards'} cardsManagementStyle={true} />
                            <LayoutSidebarItem title={'Rarities'} href={'/rarities'} cardsManagementStyle={true} />
                            <LayoutSidebarItem title={'Surfaces'} href={'/surfaces'} cardsManagementStyle={true} />
                        </List>
                    </AccordionDetails>
                </Accordion>
                <LayoutSidebarItem icon={ReceiptIcon} title={'Ledger'} href={'/ledger'} comingSoon />
            </List>
        </Drawer>
    );
}

export default LayoutSidebar;
