import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SortState {
    sort: string;
}

export interface CategoryValue {
    category: string;
}

export interface GradeValue {
    grade: string;
}

export interface FeedSliceState {
    SortState: SortState;
    CategoryValue: CategoryValue;
    GradeValue: GradeValue;
}

const initialState: FeedSliceState = {
    SortState: {
        sort: '',
    },
    CategoryValue: {
        category: '',
    },
    GradeValue: {
        grade: '',
    },
};

export const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        setSortByValue: (state, action: PayloadAction<string>) => {
            state.SortState.sort = action.payload;
        },
        setCategoryValue: (state, action: PayloadAction<string>) => {
            state.CategoryValue.category = action.payload;
        },
        setGradeValue: (state, action: PayloadAction<string>) => {
            state.GradeValue.grade = action.payload;
        },
    },
});

export const { setSortByValue, setCategoryValue, setGradeValue } = feedSlice.actions;
