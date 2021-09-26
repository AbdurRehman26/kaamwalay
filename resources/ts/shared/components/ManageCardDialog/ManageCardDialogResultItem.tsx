import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import { plainToClass } from 'class-transformer';
import { useCallback, useMemo } from 'react';
import { Hit } from 'react-instantsearch-core';
import { batch } from 'react-redux';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useSharedDispatch } from '@shared/hooks/useSharedSelector';
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
                primary={item.getName()}
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
