import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SelectedIdsState {
    selectedIds: number[];
}

const initialState: SelectedIdsState = {
    selectedIds: [],
};

export const submissionSelection = createSlice({
    name: 'submissionSelection',
    initialState,
    reducers: {
        setSubmissionIds: (state, action: PayloadAction<{ ids: number[] | [] }>) => {
            // @ts-ignore
            state.selectedIds = action.payload.ids;
        },
    },
    extraReducers: {},
});

export const { setSubmissionIds } = submissionSelection.actions;
