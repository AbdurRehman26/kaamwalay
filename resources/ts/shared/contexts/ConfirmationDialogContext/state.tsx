import { ButtonProps } from '@mui/material/Button';
import { DialogProps } from '@mui/material/Dialog';
import { Defer } from '@shared/classes/Defer';

export interface ConfirmationDialogContextState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    breakpoint: Defer | null;
    dialogProps: Omit<DialogProps, 'open' | 'onClose'>;
    confirmButtonProps: ButtonProps;
    cancelButtonProps: ButtonProps;
}

export interface ConfirmationDialogContextMethods {
    open(breakpoint: Defer, config: Partial<ConfirmationDialogContextState>): void;
    resolve(): void;
    reject(): void;
}

export const initialState: ConfirmationDialogContextState = {
    dialogProps: {},
    cancelButtonProps: {},
    confirmButtonProps: {},
    cancelText: 'Cancel',
    message: '',
    confirmText: 'Ok',
    isOpen: false,
    title: 'Are you sure?',
    breakpoint: null,
};
