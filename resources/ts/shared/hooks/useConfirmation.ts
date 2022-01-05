import { useContext, useMemo } from 'react';
import { Defer } from '../classes/Defer';
import { ConfirmationDialogContext, ConfirmationDialogContextState } from '../contexts/ConfirmationDialogContext';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @date: 05.08.2021
 * @time: 18:18
 */
export function useConfirmation() {
    const state = useContext(ConfirmationDialogContext);

    return useMemo(
        () =>
            async (config: Partial<ConfirmationDialogContextState> = {}) => {
                const defer = new Defer();
                state.open(defer, { ...config });
                return defer.wait();
            },
        [state],
    );
}
