import { DialogProps } from '@mui/material/Dialog';
import { useCallback, useState } from 'react';

export function useNotesDialog(): DialogProps & {
    handleOpen(data: Record<string, any>): void;
    extraData: Record<string, any>;
} {
    const [open, setOpen] = useState(false);
    const [extraData, setExtraData] = useState({});

    const handleOpen = useCallback(
        (data: Record<string, any> = {}) => {
            setExtraData(data);
            setOpen(true);
        },
        [setOpen, setExtraData],
    );

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return {
        open,
        extraData,
        handleOpen,
        onClose: handleClose,
    };
}
