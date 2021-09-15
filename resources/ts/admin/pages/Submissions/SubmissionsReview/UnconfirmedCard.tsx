import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback } from 'react';
import dummyCharizard from '@shared/assets/dummyCharizard.png';
import {
    AccordionCardItemHeader,
    AccordionCardItem,
    AccordionCardItemProps,
} from '@shared/components/AccordionCardItem';
import { cx } from '@shared/lib/utils/cx';
import { font } from '@shared/styles/utils';

interface UnconfirmedCardProps extends AccordionCardItemProps {
    itemId: number;
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

export function UnconfirmedCard({ itemId, onConfirm, onMissing, onPreview }: UnconfirmedCardProps) {
    const classes = useStyles();

    const handleConfirm = useCallback(() => onConfirm(itemId), [onConfirm, itemId]);
    const handleMissing = useCallback(() => onMissing(itemId), [onMissing, itemId]);
    const handlePreview = useCallback(() => onPreview(itemId), [onPreview, itemId]);

    return (
        <AccordionCardItem divider>
            <AccordionCardItemHeader
                heading={'Charizard'}
                subheading={'2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard'}
                image={dummyCharizard}
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
        </AccordionCardItem>
    );
}

export default UnconfirmedCard;
