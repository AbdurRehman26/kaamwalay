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

export interface filterCount {
    count: number;
}

export interface FeedSliceState {
    SortState: SortState;
    CategoryValue: CategoryValue;
    GradeValue: GradeValue;
    filterCount: filterCount;
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
    filterCount: {
        count: 0,
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
        setFilterIncrement: (state) => {
            state.filterCount.count += 1;
        },
        setFilterDecrement: (state) => {
            state.filterCount.count -= 1;
        },
    },
});

export const { setSortByValue, setCategoryValue, setGradeValue, setFilterIncrement, setFilterDecrement } =
    feedSlice.actions;
