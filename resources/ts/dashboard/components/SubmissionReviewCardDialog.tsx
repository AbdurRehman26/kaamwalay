import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useCallback, useMemo, useState } from 'react';
import { ReviewCardDialog, ReviewCardDialogProps } from '@shared/components/ReviewCardDialog';
import { CardProductEntity } from '@shared/entities/CardProductEntity';

interface SubmissionReviewCardDialogProps extends Omit<ReviewCardDialogProps, 'children'> {
    items: CardProductEntity[];
    activeId?: number | null;
    exists?: boolean;
    onChangeId?: (id: number) => void;
    onAdd?: (item: CardProductEntity) => Promise<void> | void;
    onRemove(item: CardProductEntity): Promise<void> | void;
}

export function SubmissionReviewCardDialog({
    items,
    activeId,
    open,
    exists,
    onClose,
    onRemove,
    onAdd,
    onChangeId,
}: SubmissionReviewCardDialogProps) {
    const [loading, setLoading] = useState(false);
    const activeItemIndex = useMemo(() => items.findIndex(({ id }) => id === activeId), [items, activeId]);
    const previousItem = useMemo(() => items[activeItemIndex - 1] ?? null, [items, activeItemIndex]);
    const currentItem = useMemo(() => items[activeItemIndex] ?? null, [items, activeItemIndex]);
    const nextItem = useMemo(() => items[activeItemIndex + 1] ?? null, [items, activeItemIndex]);

    const handleNext = useCallback(() => {
        if (nextItem && onChangeId) {
            onChangeId(nextItem.id);
        }
    }, [nextItem, onChangeId]);

    const handlePrevious = useCallback(() => {
        if (previousItem && onChangeId) {
            onChangeId(previousItem.id);
        }
    }, [previousItem, onChangeId]);

    const handleClose = useCallback(() => {
        if (onClose) {
            (onClose as any)();
        }
    }, [onClose]);

    const handleRemove = useCallback(async () => {
        setLoading(true);
        try {
            await onRemove(currentItem);
        } catch (e) {
            //
        }
        setLoading(false);
    }, [currentItem, onRemove]);

    const handleAdd = useCallback(async () => {
        setLoading(true);
        try {
            if (onAdd) {
                await onAdd(currentItem);
            }
        } catch (e) {
            //
        }
        setLoading(false);
    }, [currentItem, onAdd]);

    return (
        <ReviewCardDialog
            itemsLength={items.length}
            open={open}
            onClose={onClose}
            onNext={handleNext}
            onPrevious={handlePrevious}
            activeItem={currentItem}
            disableNext={!nextItem || !onChangeId}
            disablePrevious={!previousItem || !onChangeId}
        >
            <Grid item xs={12} sm>
                <Button variant={'contained'} size={'large'} color={'inherit'} fullWidth onClick={handleClose}>
                    Close
                </Button>
            </Grid>
            <Grid item xs={12} sm>
                <Button
                    variant={'contained'}
                    size={'large'}
                    disabled={loading}
                    onClick={exists ? handleRemove : handleAdd}
                    startIcon={loading ? <CircularProgress size={24} color={'inherit'} /> : null}
                    fullWidth
                >
                    {exists ? 'Remove' : 'Add to Submission'}
                </Button>
            </Grid>
        </ReviewCardDialog>
    );
}
