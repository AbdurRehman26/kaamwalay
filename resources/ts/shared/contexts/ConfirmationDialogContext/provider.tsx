import React, { PropsWithChildren, useMemo, useReducer } from 'react';

import { Defer } from '@shared/classes/Defer';
import { ConfirmationDialogContext } from '@shared/contexts/ConfirmationDialogContext/context';
import { confirmationDialogContextReducer } from '@shared/contexts/ConfirmationDialogContext/reducer';
import { ConfirmationDialogContextState, initialState } from '@shared/contexts/ConfirmationDialogContext/state';

interface ConfirmationDialogProviderProps {}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.comm>
 * @component: Provider
 * @date: 05.08.2021
 * @time: 17:44
 */
export function ConfirmationDialogProvider({ children }: PropsWithChildren<ConfirmationDialogProviderProps>) {
    const [reducerState, dispatch] = useReducer(confirmationDialogContextReducer, initialState);
    const state = useMemo(
        () => ({
            ...reducerState,
            open: (breakpoint: Defer, config: Partial<ConfirmationDialogContextState>) =>
                dispatch({ type: 'setOpen', payload: { breakpoint, config } }),
            resolve: () => {
                dispatch({ type: 'resolve' });
                setTimeout(() => dispatch({ type: 'reset' }), 300);
            },
            reject: () => {
                dispatch({ type: 'reject' });
                setTimeout(() => dispatch({ type: 'reset' }), 300);
            },
        }),
        [reducerState, dispatch],
    );

    return <ConfirmationDialogContext.Provider value={state}>{children}</ConfirmationDialogContext.Provider>;
}

export default ConfirmationDialogProvider;
