import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type Modals = {
    loading: {
        state: 'loading' | 'loaded' | 'error';
        message: string;
    };
};

export type ModalsKeys = keyof Modals;

export interface ModalsStateType {
    instances: {
        [K in ModalsKeys]?: {
            isOpen: boolean;
            data: Modals[K] | null;
        };
    };
}

export const modalsSlice = createSlice({
    name: 'modals',

    initialState: {
        instances: {},
    } as ModalsStateType,

    reducers: {
        open(state, action: PayloadAction<{ key: ModalsKeys; data?: any }>) {
            const { key, data } = action.payload;
            state.instances[key] = {
                isOpen: true,
                data: data || null,
            };
        },

        setData(state, action: PayloadAction<{ key: ModalsKeys; data: any }>) {
            const { key, data } = action.payload;
            const modal = state.instances[key];

            state.instances[key] = {
                isOpen: !!modal?.isOpen,
                data: {
                    ...modal?.data,
                    ...data,
                },
            };
        },

        close(state, action: PayloadAction<{ key: ModalsKeys }>) {
            const { key } = action.payload;
            state.instances[key] = {
                isOpen: false,
                data: null,
            };
        },
    },
});

export function openModal<K extends ModalsKeys>(key: K, data?: Modals[K]) {
    return modalsSlice.actions.open({ key, data });
}

export function setModalData<K extends ModalsKeys>(key: K, data: Partial<Modals[K]>) {
    return modalsSlice.actions.setData({ key, data });
}

export function closeModal<K extends ModalsKeys>(key: K) {
    return modalsSlice.actions.close({ key });
}
