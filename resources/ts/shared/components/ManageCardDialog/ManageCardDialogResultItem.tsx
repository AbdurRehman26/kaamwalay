import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { plainToClass } from 'class-transformer';
import { useCallback, useMemo } from 'react';
import { Hit } from 'react-instantsearch-core';
import { batch } from 'react-redux';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { fromApiPropertiesObject } from '../../lib/utils/fromApiPropertiesObject';

interface ManageCardDialogResultItemProps {
    hit: Hit<CardProductEntity>;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(1.5, 2),
        },
        listAvatar: {
            minWidth: 34,
            display: 'flex',
            alignItems: 'center',
        },
        listItemText: {
            // We subtract 34px (avatar width), 30px (action width), 8px (action padding)
            maxWidth: 'calc(100% - 72px)',
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
            width: 28,
        },
    }),
    { name: 'ManageCardDialogResultItem' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialogResultItem
 * @date: 13.09.2021
 * @time: 23:53
 */
export function ManageCardDialogResultItem({ hit }: ManageCardDialogResultItemProps) {
    const item = useMemo(() => plainToClass(CardProductEntity, fromApiPropertiesObject(hit)), [hit]);
    const classes = useStyles();
    const dispatch = useSharedDispatch();

    const handleSelect = useCallback(() => {
        batch(() => {
            dispatch(manageCardDialogActions.setSelectedCard(item));
            dispatch(manageCardDialogActions.navigateToPreviousView());
        });
    }, [dispatch, item]);

    return (
        <ListItem
            component={'div'}
            ContainerComponent={'div'}
            className={classes.root}
            divider
            alignItems={'flex-start'}
        >
            <ListItemAvatar className={classes.listAvatar}>
                <img className={classes.image} src={item.imagePath} alt={item.name} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box flexDirection={'column'}>
                        <Typography
                            variant="caption"
                            sx={{ display: 'block', marginBottom: item.shortName ? '-6px' : 0 }}
                        >
                            {item.getName()}
                        </Typography>
                        {item.shortName ? (
                            <Typography variant={'caption'} className={classes.shortNameText}>
                                {item.shortName}
                            </Typography>
                        ) : null}
                    </Box>
                }
                secondary={item.getDescription()}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
                className={classes.listItemText}
            />
            <ListItemSecondaryAction>
                <IconButton size={'small'} onClick={handleSelect}>
                    <ArrowForwardIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default ManageCardDialogResultItem;
