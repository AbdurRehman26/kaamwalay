import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useState } from 'react';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { cx } from '@shared/lib/utils/cx';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { font } from '@shared/styles/utils';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface CardItemProps {
    label: any | string;
    itemId: number;
    card: CardProductEntity;
    labelIcon?: any;
    notes?: string;

    certificateId?: number | string;
    declaredValue?: number;

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
        shortName: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '10px',
            lineHeight: '14px',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            color: 'rgba(0, 0, 0, 0.54)',
            display: 'block',
        },
        image: {
            width: 28,
            marginRight: theme.spacing(1),
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.2)',
            '&.large': {
                width: 48,
            },
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
            padding: theme.spacing(0, 1),
        },
        gutterLeft: {
            marginLeft: theme.spacing(2),
            '&:first-child': {
                marginLeft: 0,
            },
        },
        closeButton: {
            marginLeft: theme.spacing(1),
        },
    }),
    { name: 'CardItem' },
);

export function CardItem({
    label,
    itemId,
    card,
    labelIcon,
    certificateId,
    declaredValue,
    onRemove,
    notes,
}: CardItemProps) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const notifications = useNotifications();

    const handleRemove = useCallback(async () => {
        setLoading(true);
        try {
            await onRemove(itemId);
        } catch (e: any) {
            notifications.exception(e);
        }
        setLoading(false);
    }, [onRemove, itemId, notifications]);

    return (
        <Grid container alignItems={'center'} className={classes.root}>
            <Box
                display={'flex'}
                flexGrow={1}
                flexWrap={'nowrap'}
                alignItems={'flex-start'}
                maxWidth={'calc(100% - 68px)'}
            >
                <img
                    src={card.imagePath}
                    alt={'card'}
                    className={cx(classes.image, { large: !!(certificateId || declaredValue) })}
                />
                <Box flexGrow={1} pr={1}>
                    <Typography variant={'body2'} className={font.fontWeightMedium}>
                        {card.getName()}
                    </Typography>
                    <Box flexDirection={'column'}>
                        <Typography variant={'caption'} className={classes.shortName}>
                            {card.getShortName()}
                        </Typography>
                        <Typography variant={'caption'}>{card.getLongName()}</Typography>
                    </Box>

                    {certificateId || declaredValue ? (
                        <Box>
                            {certificateId && (
                                <Typography variant={'caption'}>
                                    <span className={font.fontWeightMedium}>Certificate ID:</span>
                                    &nbsp;
                                    <span>{certificateId}</span>
                                </Typography>
                            )}

                            {declaredValue && (
                                <Typography variant={'caption'} className={classes.gutterLeft}>
                                    <span className={font.fontWeightMedium}>Value:</span>
                                    &nbsp;
                                    <span>{formatCurrency(declaredValue)}</span>
                                </Typography>
                            )}
                        </Box>
                    ) : null}

                    {notes ? (
                        <Accordion sx={{ marginTop: '6px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Notes</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{notes}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ) : null}
                </Box>
            </Box>

            {typeof label === 'string' ? (
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
            ) : (
                label
            )}

            <IconButton size={'small'} onClick={handleRemove} disabled={loading} className={classes.closeButton}>
                {loading ? <CircularProgress size={24} color={'inherit'} /> : <CloseIcon />}
            </IconButton>
        </Grid>
    );
}

export default CardItem;
