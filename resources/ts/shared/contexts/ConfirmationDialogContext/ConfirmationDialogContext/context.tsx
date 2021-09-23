import React from 'react';
import { ConfirmationDialogContextMethods, ConfirmationDialogContextState, initialState } from './state';

export const ConfirmationDialogContext = React.createContext<
    ConfirmationDialogContextState & ConfirmationDialogContextMethods
>({
    ...initialState,
    open(): void {},
    reject(): void {},
    resolve(): void {},
});
