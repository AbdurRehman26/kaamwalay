import { useCallback } from 'react';
import { useSharedSelector } from '../../hooks/useSharedDispatch';
import { GlobalStateType } from '../store';

type State = GlobalStateType['addCardDialog'];
type Selector<TState, TReturn> = (state: TState) => TReturn;
const defaultSelector = (state: State) => state;

export function useAddCardDialogState<TReturn = State>(selector?: Selector<State, TReturn>): TReturn {
    const selectorCallback = useCallback(
        (state) => {
            if (selector) {
                (selector as Selector<State, any>)(state.addCardDialog);
            }
            return defaultSelector(state.addCardDialog);
        },
        [selector],
    );

    return useSharedSelector(selectorCallback) as any;
}
