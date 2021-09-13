import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { plainToClass } from 'class-transformer';
import { useCallback, useMemo } from 'react';
import { Hit } from 'react-instantsearch-core';
import { batch } from 'react-redux';
import { AddCardDialogViewEnum } from '@shared/constants/AddCardDialogViewEnum';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useSharedDispatch } from '@shared/hooks/useSharedSelector';
import { selectAddCardDialog, setAddCardDialogView } from '@shared/redux/slices/addCardDialogSlice';

interface AddCardDialogResultItemProps {
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
    { name: 'AddCardDialogResultItem' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AddCardDialogResultItem
 * @date: 13.09.2021
 * @time: 23:53
 */
export function AddCardDialogResultItem({ hit }: AddCardDialogResultItemProps) {
    const item = useMemo(() => plainToClass(CardProductEntity, hit), [hit]);
    const classes = useStyles();
    const dispatch = useSharedDispatch();

    const handleSelect = useCallback(() => {
        batch(() => {
            dispatch(setAddCardDialogView(AddCardDialogViewEnum.Card));
            dispatch(selectAddCardDialog(hit));
        });
    }, [dispatch, hit]);

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

export default AddCardDialogResultItem;
