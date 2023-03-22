import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import {
    AccordionCardItem,
    AccordionCardItemHeader,
    AccordionCardItemProps,
} from '@shared/components/AccordionCardItem';
import AccordionCardItemLoader from '@shared/components/AccordionCardItem/AccordionCardItemLoader';
import OutlinedCard from '@shared/components/OutlinedCard';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { font } from '@shared/styles/utils';

interface UnconfirmedCardProps extends AccordionCardItemProps {
    itemId: number;
    declaredValue: number;
    card: CardProductEntity;
    disableConfirm?: boolean;
    internalNotes?: string;
    notes?: string;
    orderId: number;
    onConfirm(index: number): void;

    onMissing: any;

    onNotAccepted: any;

    onEdit(index: number): void;

    onPreview(index: number): void;

    onSwapCard(index: number): void;
    onCardNotesChange: any;
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
        notAcceptedButtons: {
            marginTop: theme.spacing(1.5),
            textAlign: 'right',
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
    onNotAccepted,
    onEdit,
    onPreview,
    onSwapCard,
    disableConfirm,
    internalNotes,
    notes,
    onCardNotesChange,
}: UnconfirmedCardProps) {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [cardInternalNotes, setInternalNotes] = useState(internalNotes);
    const [notAcceptedNotes, setNotAcceptedNotes] = useState(notes);
    const notification = useNotifications();
    const [openNotAccepted, setOpenNotAccepted] = useState(false);

    const handleCardNotesChange = useCallback(
        (internalNotes?: string, notes?: string) => {
            setLoading(true);
            try {
                onCardNotesChange(itemId, internalNotes, notes).then(() => {
                    setLoading(false);
                });
            } catch (e: any) {
                notification.exception(e);
                setLoading(false);
            }
        },
        [itemId, notification, onCardNotesChange],
    );

    const debounceNotes = useMemo(() => debounce(handleCardNotesChange, 500), [handleCardNotesChange]);

    const handleSetCardNotes = useCallback(
        (event) => {
            setInternalNotes(event.target.value);
            debounceNotes(event.target.value);
        },
        [debounceNotes],
    );

    const handleNotAcceptedNotes = useCallback(
        (event) => {
            setNotAcceptedNotes(event.target.value);
            debounceNotes('', event.target.value);
        },
        [debounceNotes],
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

    const handleNotAccepted = useCallback(async () => {
        setLoading(true);
        try {
            await onNotAccepted(itemId);
            setOpenNotAccepted(false);
            setNotAcceptedNotes('');
        } catch (e: any) {
            notification.exception(e);
        }
        // TODO: fix memory leak error (dispatched action on unmounted component)
        setLoading(false);
    }, [itemId, notification, onNotAccepted]);

    const handleEdit = useCallback(async () => {
        setLoading(true);
        try {
            await onEdit(itemId);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading(false);
    }, [itemId, notification, onEdit]);

    const handleSwapCard = useCallback(async () => {
        setLoading(true);
        try {
            await onSwapCard(itemId);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading(false);
    }, [itemId, notification, onSwapCard]);

    return (
        <AccordionCardItem divider>
            <AccordionCardItemHeader
                heading={card.getName()}
                shortName={card.getShortName()}
                subheading={card.getLongName()}
                image={card.imagePath}
                onPreview={handlePreview}
                action={
                    !openNotAccepted && (
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            className={classes.button}
                            disabled={disableConfirm}
                            onClick={handleConfirm}
                        >
                            Confirm
                        </Button>
                    )
                }
            >
                <Typography variant={'caption'}>
                    <span className={font.fontWeightMedium}>Value:</span>
                    &nbsp;
                    <span>{formatCurrency(declaredValue)}</span>
                </Typography>

                {!openNotAccepted && (
                    <>
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
                                <Button
                                    variant={'contained'}
                                    color={'inherit'}
                                    onClick={handleSwapCard}
                                    className={classes.leftSpace}
                                >
                                    Swap Card
                                </Button>
                                <Button
                                    variant={'contained'}
                                    color={'inherit'}
                                    onClick={() => setOpenNotAccepted(true)}
                                    className={classes.leftSpace}
                                >
                                    Not Accepted
                                </Button>
                            </Box>
                        </Grid>

                        <Box marginTop={'18px'} width={'100%'}>
                            <TextField
                                label="Internal Notes"
                                fullWidth
                                multiline
                                value={cardInternalNotes}
                                onChange={handleSetCardNotes}
                                placeholder={'Internal Notes'}
                                rows={4}
                            />
                        </Box>
                    </>
                )}
            </AccordionCardItemHeader>

            {openNotAccepted && (
                <>
                    <OutlinedCard className={classes.buttons} heading={'Notes'}>
                        <TextField
                            label="Enter Notes"
                            multiline
                            rows={4}
                            onChange={handleNotAcceptedNotes}
                            value={notAcceptedNotes}
                            sx={{ marginTop: '16px' }}
                            fullWidth
                        />
                    </OutlinedCard>

                    <div className={classes.notAcceptedButtons}>
                        <Button
                            variant={'contained'}
                            disableElevation
                            onClick={() => setOpenNotAccepted(false)}
                            className={'classes.submitButton'}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={'contained'}
                            disableElevation
                            disabled={!true}
                            color={'primary'}
                            onClick={handleNotAccepted}
                            className={classes.leftSpace}
                        >
                            Done
                        </Button>
                    </div>
                </>
            )}
            <AccordionCardItemLoader show={loading} />
        </AccordionCardItem>
    );
}

export default UnconfirmedCard;
