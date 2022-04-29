import { useCallback, useMemo, useState } from 'react';

export function useDialogHelper() {
    const [isOpen, setOpen] = useState(false);

    const buttonProps = useMemo(
        () => ({
            onClick: () => setOpen(true),
        }),
        [],
    );

    const dialogProps = useMemo(
        () => ({
            open: isOpen,
            onClose: () => setOpen(false),
        }),
        [isOpen],
    );

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    return {
        isOpen,
        setOpen,
        buttonProps,
        dialogProps,
        open,
        close,
    };
}
