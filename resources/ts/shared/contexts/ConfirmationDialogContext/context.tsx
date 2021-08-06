import React from 'react';

import { ConfirmationDialogContextMethods, ConfirmationDialogContextState, initialState } from './state';

export const ConfirmationDialogContext = React.createContext<
    ConfirmationDialogContextState & ConfirmationDialogContextMethods
>({
    open(): void {},
    ...initialState,
    reject(): void {},
    resolve(): void {},
});
