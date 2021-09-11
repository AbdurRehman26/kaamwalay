import { Defer } from '@shared/classes/Defer';

export interface ConfirmationDialogContextState {
    isOpen: boolean;
    title: string;
    message: string;
    okText: string;
    cancelText: string;
    okDisabled: boolean;
    cancelDisabled: boolean;
    breakpoint: Defer | null;
}

export interface ConfirmationDialogContextMethods {
    open(breakpoint: Defer, config: Partial<ConfirmationDialogContextState>): void;
    resolve(): void;
    reject(): void;
}

export const initialState: ConfirmationDialogContextState = {
    cancelDisabled: false,
    cancelText: 'Cancel',
    message: '',
    okDisabled: false,
    okText: 'Ok',
    isOpen: false,
    title: 'Are you sure?',
    breakpoint: null,
};
