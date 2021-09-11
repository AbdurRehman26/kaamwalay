import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useCallback, useState } from 'react';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { font } from '@shared/styles/utils';

interface CardItemProps {
    label: string;
    itemId: number;
    card: CardProductEntity;
    labelIcon?: any;

    onRemove(orderItemId: number): void;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(1.5, 2),
            borderBottom: '1px solid #e0e0e0',
            '&:last-child': {
                borderBottom: 'none',
            },
        },
        image: {
            width: 28,
            marginRight: theme.spacing(1),
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.2)',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
            padding: theme.spacing(0, 1),
        },
    }),
    { name: 'CardItem' },
);

export function CardItem({ label, itemId, card, labelIcon, onRemove }: CardItemProps) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const notifications = useNotifications();

    const handleRemove = useCallback(async () => {
        setLoading(true);
        try {
            await onRemove(itemId);
        } catch (e) {
            notifications.exception(e);
        }
        setLoading(false);
    }, [onRemove, itemId, notifications]);

    return (
        <Grid container alignItems={'center'} className={classes.root}>
            <Box display={'flex'} flexGrow={1}>
                <img src={card.imagePath} alt={'card'} className={classes.image} />
                <Box flexGrow={1}>
                    <Typography variant={'body2'} className={font.fontWeightMedium}>
                        {card.getName()}
                    </Typography>
                    <Typography variant={'caption'}>{card.getDescription()}</Typography>
                </Box>
            </Box>

            <Typography variant={'body2'} color={'textSecondary'} className={classes.label}>
                {labelIcon ? (
                    <>
                        {labelIcon}
                        <Box component={'span'} pl={0.5}>
                            {label}
                        </Box>
                    </>
                ) : (
                    label
                )}
            </Typography>

            <IconButton size={'small'} onClick={handleRemove} disabled={loading}>
                {loading ? <CircularProgress size={24} color={'inherit'} /> : <CloseIcon />}
            </IconButton>
        </Grid>
    );
}

export default CardItem;
