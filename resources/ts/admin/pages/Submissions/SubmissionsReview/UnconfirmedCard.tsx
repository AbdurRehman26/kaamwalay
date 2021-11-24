import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useEffect, useState } from 'react';
import {
    AccordionCardItem,
    AccordionCardItemHeader,
    AccordionCardItemProps,
} from '@shared/components/AccordionCardItem';
import AccordionCardItemLoader from '@shared/components/AccordionCardItem/AccordionCardItemLoader';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { font } from '@shared/styles/utils';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';

interface UnconfirmedCardProps extends AccordionCardItemProps {
    itemId: number;
    declaredValue: number;
    card: CardProductEntity;
    notes?: string;
    onConfirm(index: number): void;

    onMissing(index: number): void;

    onEdit(index: number): void;

    onPreview(index: number): void;

    onCardNotesChange(index: number): void;
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
    itemId,
    card,
    declaredValue,
    onConfirm,
    onMissing,
    onEdit,
    onPreview,
    notes,
    onCardNotesChange,
}: UnconfirmedCardProps) {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [cardNotes, setCardNotes] = useState(notes);

    const notification = useNotifications();

    const handleSetCardNotes = useCallback(
        (event) => {
            setCardNotes(event.target.value);
        },
        [setCardNotes, cardNotes],
    );

    const handlePreview = useCallback(() => onPreview(itemId), [onPreview, itemId]);

    const handleConfirm = useCallback(async () => {
        setLoading(true);
        try {
            await onConfirm(itemId);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading(false);
    }, [onConfirm, itemId, notification]);

    const handleMissing = useCallback(async () => {
        setLoading(true);
        try {
            await onMissing(itemId);
        } catch (e: any) {
            notification.exception(e);
        }
        // TODO: fix memory leak error (dispatched action on unmounted component)
        setLoading(false);
    }, [onMissing, itemId, notification]);

    const handleEdit = useCallback(async () => {
        setLoading(true);
        try {
            await onEdit(itemId);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading(false);
    }, [itemId, notification, onEdit]);

    const handleCardNotesChange = useCallback(async () => {
        setLoading(true);
        try {
            await onCardNotesChange(itemId, cardNotes);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading(false);
    }, [itemId, notification, onCardNotesChange, cardNotes]);

    useEffect(() => {
        // Calling notes api whenever user stops typing
        let debouncer = setTimeout(() => {
            handleCardNotesChange(itemId, cardNotes);
        }, 400);
        return () => {
            clearTimeout(debouncer);
        };
    }, [cardNotes]);
    return (
        <AccordionCardItem divider>
            <AccordionCardItemHeader
                heading={card.getName()}
                shortName={card.getShortName()}
                subheading={card.getLongName()}
                image={card.imagePath}
                onPreview={handlePreview}
                action={
                    <Button variant={'contained'} color={'primary'} className={classes.button} onClick={handleConfirm}>
                        Confirm
                    </Button>
                }
            >
                <Typography variant={'caption'}>
                    <span className={font.fontWeightMedium}>Value:</span>
                    &nbsp;
                    <span>{formatCurrency(declaredValue)}</span>
                </Typography>

                <Grid container direction={'column'} className={classes.buttons}>
                    <Box display={'flex'} flexDirection={'row'}>
                        <Button variant={'contained'} color={'inherit'} onClick={handleMissing}>
                            Missing
                        </Button>
                        <Button
                            variant={'contained'}
                            color={'inherit'}
                            onClick={handleEdit}
                            className={classes.leftSpace}
                        >
                            Edit
                        </Button>
                    </Box>
                </Grid>
                <Box marginTop={'18px'} width={'100%'}>
                    <TextField
                        label="Enter Notes"
                        fullWidth
                        multiline
                        value={cardNotes}
                        onChange={handleSetCardNotes}
                        placeholder={'Notes'}
                        rows={4}
                    />
                </Box>
            </AccordionCardItemHeader>
            <AccordionCardItemLoader show={loading} />
        </AccordionCardItem>
    );
}

export default UnconfirmedCard;
