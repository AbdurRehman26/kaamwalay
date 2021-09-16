import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

export const getAllSubmissions = createAsyncThunk('submissionGrades/getSubmissionsAndGrades', async (id) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/orders/${id}/grades`);
    const cardsResponse = await endpoint.get('');
    return cardsResponse.data;
});

export interface SubmissionsGrades {
    allSubmissions: any;
}

const initialState: SubmissionsGrades = {
    allSubmissions: [],
};

export const submissionGradesSlice = createSlice({
    name: 'submissionGradesSlice',
    initialState,
    reducers: {
        updateHumanGradeValue: (
            state,
            action: PayloadAction<{ itemIndex: number; side: string; part: string; gradeValue: number }>,
        ) => {
            state.allSubmissions[action.payload.itemIndex].human_grade_values[action.payload.side][
                action.payload.part
            ] = action.payload.gradeValue;
        },
        updateExistingCardData: (state, action: PayloadAction<{ id: number; data: any }>) => {
            const itemIndex = state.allSubmissions.findIndex((p: any) => p.id === action.payload.id);
            state.allSubmissions[itemIndex] = action.payload.data;
        },
    },
    extraReducers: {
        [getAllSubmissions.fulfilled as any]: (state, action) => {
            state.allSubmissions = action.payload;
        },
    },
});

export const { updateHumanGradeValue, updateExistingCardData } = submissionGradesSlice.actions;
