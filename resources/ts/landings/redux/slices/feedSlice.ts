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

export interface GradeTeal {
    teal: boolean;
}

export interface CategoryTeal {
    teal: boolean;
}

export interface FilterCount {
    count: number;
}

export interface FilterResults {
    results: number;
}

export interface FeedSliceState {
    sortState: SortState;
    categoryValue: CategoryValue;
    gradeValue: GradeValue;
    filterCount: FilterCount;
    categoryTeal: CategoryTeal;
    gradeTeal: GradeTeal;
    filterResults: FilterResults;
}

const initialState: FeedSliceState = {
    sortState: {
        sort: '',
    },
    categoryValue: {
        category: '',
    },
    gradeValue: {
        grade: '',
    },
    filterCount: {
        count: 0,
    },
    categoryTeal: {
        teal: false,
    },
    gradeTeal: {
        teal: false,
    },
    filterResults: {
        results: 0,
    },
};

export const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        setSortByValue: (state, action: PayloadAction<string>) => {
            state.sortState.sort = action.payload;
        },
        setCategoryValue: (state, action: PayloadAction<string>) => {
            state.categoryValue.category = action.payload;
        },
        setGradeValue: (state, action: PayloadAction<string>) => {
            state.gradeValue.grade = action.payload;
        },
        setFilterIncrement: (state) => {
            state.filterCount.count += 1;
        },
        setFilterDecrement: (state) => {
            state.filterCount.count -= 1;
        },
        setGradeTeal: (state, action: PayloadAction<boolean>) => {
            state.gradeTeal.teal = action.payload;
        },
        setCategoryTeal: (state, action: PayloadAction<boolean>) => {
            state.categoryTeal.teal = action.payload;
        },
        setFilterResults: (state, action: PayloadAction<number>) => {
            state.filterResults.results = action.payload;
        },
    },
});

export const {
    setSortByValue,
    setCategoryValue,
    setGradeValue,
    setFilterIncrement,
    setFilterDecrement,
    setGradeTeal,
    setCategoryTeal,
    setFilterResults,
} = feedSlice.actions;
