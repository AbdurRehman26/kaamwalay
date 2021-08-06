import { Action, PayloadAction } from '@reduxjs/toolkit';

import { Defer } from '@shared/classes/Defer';
import { ConfirmationDialogContextState, initialState } from '@shared/contexts/ConfirmationDialogContext/state';

type Actions =
    | Action<'resolve'>
    | Action<'reject'>
    | Action<'reset'>
    | PayloadAction<
          {
              breakpoint: Defer;
              config: Partial<ConfirmationDialogContextState>;
          },
          'setOpen'
      >;

export function confirmationDialogContextReducer(state: ConfirmationDialogContextState, action: Actions) {
    switch (action.type) {
        case 'setOpen':
            return {
                ...state,
                ...action.payload.config,
                isOpen: true,
                breakpoint: action.payload.breakpoint,
            };
        case 'resolve':
            if (state.breakpoint) {
                state.breakpoint.resolve(true);
                state.breakpoint = null;
            }
            return { ...state, isOpen: false };
        case 'reject':
            if (state.breakpoint) {
                state.breakpoint.resolve(false);
                state.breakpoint = null;
            }
            return { ...state, isOpen: false };
        case 'reset':
            return { ...initialState };
    }
    return state;
}
