import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
import { cx } from '@shared/lib/utils/cx';
import { font } from '@shared/styles/utils';

interface UnconfirmedCardProps extends AccordionCardItemProps {
    index: number;
    itemId: number;
    card: CardProductEntity;
    onConfirm(index: number): void;
    onMissing(index: number): void;
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
    }),
    { name: 'UnconfirmedCard' },
);

export function UnconfirmedCard({ index, itemId, card, onConfirm, onMissing, onPreview }: UnconfirmedCardProps) {
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
        setLoading(false);
    }, [onMissing, itemId, notification]);

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
                <Typography variant={'body2'} className={cx(font.fontWeightMedium, classes.otherActionsText)}>
                    Other Actions:
                </Typography>
                <Button variant={'contained'} onClick={handleMissing}>
                    Missing
                </Button>
            </AccordionCardItemHeader>
            <AccordionCardItemLoader show={loading} />
        </AccordionCardItem>
    );
}

export default UnconfirmedCard;
