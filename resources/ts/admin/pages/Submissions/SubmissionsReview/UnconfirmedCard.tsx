import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useState } from 'react';
import {
    AccordionCardItem,
    AccordionCardItemHeader,
    AccordionCardItemProps,
} from '@shared/components/AccordionCardItem';
import AccordionCardItemLoader from '@shared/components/AccordionCardItem/AccordionCardItemLoader';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useNotifications } from '@shared/hooks/useNotifications';

interface UnconfirmedCardProps extends AccordionCardItemProps {
    index: number;
    itemId: number;
    card: CardProductEntity;

    onConfirm(index: number): void;

    onMissing(index: number): void;

    onEdit(index: number): void;

    onPreview(index: number): void;
}

const useStyles = makeStyles(
    (theme) => ({
        otherActionsText: {
            marginTop: theme.spacing(2),
        },
        button: {
            minWidth: 100,
        },
        leftSpace: {
            marginLeft: theme.spacing(1.25),
        },
        buttons: {
            marginTop: theme.spacing(1.5),
        },
    }),
    { name: 'UnconfirmedCard' },
);

export function UnconfirmedCard({
    index,
    itemId,
    card,
    onConfirm,
    onMissing,
    onEdit,
    onPreview,
}: UnconfirmedCardProps) {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const notification = useNotifications();

    const handlePreview = useCallback(() => onPreview(index), [onPreview, index]);

    const handleConfirm = useCallback(async () => {
        setLoading(true);
        try {
            await onConfirm(itemId);
        } catch (e) {
            notification.exception(e);
        }
        setLoading(false);
    }, [onConfirm, itemId, notification]);

    const handleMissing = useCallback(async () => {
        setLoading(true);
        try {
            await onMissing(itemId);
        } catch (e) {
            notification.exception(e);
        }
        // TODO: fix memory leak error (dispatched action on unmounted component)
        setLoading(false);
    }, [onMissing, itemId, notification]);

    const handleEdit = useCallback(async () => {
        setLoading(true);
        try {
            await onEdit(itemId);
        } catch (e) {
            notification.exception(e);
        }
        setLoading(false);
    }, [itemId, notification, onEdit]);

    return (
        <AccordionCardItem divider>
            <AccordionCardItemHeader
                heading={card.getName()}
                subheading={card.getDescription()}
                image={card.imagePath}
                onPreview={handlePreview}
                action={
                    <Button variant={'contained'} color={'primary'} className={classes.button} onClick={handleConfirm}>
                        Confirm
                    </Button>
                }
            >
                <Grid container alignItems={'center'} className={classes.buttons}>
                    <Button variant={'contained'} onClick={handleMissing}>
                        Missing
                    </Button>
                    <Button variant={'contained'} onClick={handleEdit} className={classes.leftSpace}>
                        Edit
                    </Button>
                </Grid>
            </AccordionCardItemHeader>
            <AccordionCardItemLoader show={loading} />
        </AccordionCardItem>
    );
}

export default UnconfirmedCard;
