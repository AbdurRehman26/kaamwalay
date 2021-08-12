import React, { useContext, useMemo } from 'react';

import { Defer } from '../classes/Defer';
import { ConfirmationDialogContext, ConfirmationDialogContextState } from '../contexts/ConfirmationDialogContext';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.comm>
 * @date: 05.08.2021
 * @time: 18:18
 */
export function useConfirmation() {
    const state = useContext(ConfirmationDialogContext);

    return useMemo(
        () =>
            async (message?: string, title?: string, config: Partial<ConfirmationDialogContextState> = {}) => {
                const defer = new Defer();
                if (title) {
                    config.title = title;
                }
                if (message) {
                    config.message = message;
                }

                state.open(defer, { ...config });
                return defer.wait();
            },
        [state],
    );
}
