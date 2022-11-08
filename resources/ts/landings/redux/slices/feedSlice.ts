import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SortState {
    sort: string;
}

export interface CategoryValue {
    category: Array<string>;
}

export interface GradeValue {
    grade: string;
}

export interface FilterCount {
    count: number;
}

export interface FilterResults {
    results: number;
}

export interface TotalItemsPerPage {
    itemsPerPage: number;
}

export interface FeedSliceState {
    sortState: SortState;
    categoryValue: CategoryValue;
    gradeValue: GradeValue;
    filterCount: FilterCount;
    filterResults: FilterResults;
    totalItemsPerPage: TotalItemsPerPage;
}

const initialState: FeedSliceState = {
    sortState: {
        sort: '',
    },
    categoryValue: {
        category: [],
    },
    gradeValue: {
        grade: '',
    },
    filterCount: {
        count: 0,
    },
    filterResults: {
        results: 0,
    },
    totalItemsPerPage: {
        itemsPerPage: 0,
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
            state.categoryValue.category.push(action.payload);
        },
        removeCategoryValue: (state, action: PayloadAction<string>) => {
            const categories = state.categoryValue.category;
            for (let i = 0; i < categories.length; i++) {
                if (categories[i] === action.payload) {
                    categories.splice(i, 1);
                }
            }
            state.categoryValue.category = categories;
        },
        clearAllCategories: (state) => {
            state.categoryValue.category = [];
        },
        setGradeValue: (state, action: PayloadAction<string>) => {
            state.gradeValue.grade = action.payload;
        },
        clearCount: (state) => {
            state.filterCount.count = 0;
        },
        setFilterIncrement: (state) => {
            state.filterCount.count += 1;
        },
        setFilterDecrement: (state) => {
            state.filterCount.count -= 1;
        },
        setFilterResults: (state, action: PayloadAction<number>) => {
            state.filterResults.results = action.payload;
        },
        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.totalItemsPerPage.itemsPerPage = action.payload;
        },
    },
});

export const {
    setSortByValue,
    setCategoryValue,
    removeCategoryValue,
    setGradeValue,
    setFilterIncrement,
    setFilterDecrement,
    setFilterResults,
    setItemsPerPage,
    clearAllCategories,
    clearCount,
} = feedSlice.actions;
