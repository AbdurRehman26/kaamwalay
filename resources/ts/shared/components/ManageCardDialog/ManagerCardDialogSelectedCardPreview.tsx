import { useAppSelector } from '@admin/redux/hooks';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(1.5, 2),
            backgroundColor: '#F9F9F9',
            border: '1px solid #DDDDDD',
            marginBottom: '12px',
        },
        listAvatar: {
            minWidth: 39,
            display: 'flex',
            alignItems: 'center',
        },
        listItemText: {
            // We subtract 34px (avatar width), 30px (action width), 8px (action padding)
            maxWidth: 'calc(100% - 79px)',
        },
        shortNameText: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '10px',
            lineHeight: '14px',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            color: 'rgba(0, 0, 0, 0.54)',
            display: 'block',
            marginTop: '6px',
        },
        image: {
            width: 32,
        },
    }),
    { name: 'ManageCardDialogResultItem' },
);

export default function ManagerCardDialogSelectedCardPreview() {
    const classes = useStyles();
    const selectedCard = useAppSelector((state) => state.manageCardDialog.selectedCard);

    return (
        <ListItem
            component={'div'}
            ContainerComponent={'div'}
            className={classes.root}
            divider
            alignItems={'flex-start'}
        >
            <ListItemAvatar className={classes.listAvatar}>
                <img className={classes.image} src={selectedCard?.imagePath} alt={selectedCard?.name} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box flexDirection={'column'}>
                        <Typography
                            variant="caption"
                            sx={{ display: 'block', marginBottom: selectedCard?.shortName ? '-6px' : 0 }}
                        >
                            {selectedCard?.name}
                        </Typography>
                        {selectedCard?.shortName ? (
                            <Typography variant={'caption'} className={classes.shortNameText}>
                                {selectedCard?.shortName}
                            </Typography>
                        ) : null}
                    </Box>
                }
                secondary={selectedCard?.longName}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
                className={classes.listItemText}
            />
        </ListItem>
    );
}
