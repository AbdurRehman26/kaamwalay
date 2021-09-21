import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

export const getAllSubmissions = createAsyncThunk(
    'submissionGrades/getSubmissionsAndGrades',
    async (id: number | string) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/orders/${id}/grades`);
        const cardsResponse = await endpoint.get('');
        return cardsResponse.data;
    },
);

export interface SubmissionsGrades {
    allSubmissions: any;
    viewModes: {
        name: string;
        itemIndex: number;
        notes: string;
        areNotesRequired: boolean;
        sectionTitle: string;
        notesPlaceholder: string;
        pressedDone: boolean;
        isDoneDisabled: boolean;
        prevViewMode: any;
        prevViewModeGraded: any;
    }[];
}

const initialState: SubmissionsGrades = {
    allSubmissions: [],
    viewModes: [],
};

export const submissionGradesSlice = createSlice({
    name: 'submissionGradesSlice',
    initialState,
    reducers: {
        updateHumanGradeValue: (
            state,
            action: PayloadAction<{ itemIndex: number; side: string; part: string; gradeValue: string }>,
        ) => {
            state.allSubmissions[action.payload.itemIndex].human_grade_values[action.payload.side][
                action.payload.part
            ] = action.payload.gradeValue;
        },
        updateExistingCardData: (state, action: PayloadAction<{ id: number; data: any }>) => {
            const itemIndex = state.allSubmissions.findIndex((p: any) => p.id === action.payload.id);
            state.allSubmissions[itemIndex] = action.payload.data;
        },
        updateExistingCardStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
            const itemIndex = state.allSubmissions.findIndex((p: any) => p.id === action.payload.id);
            state.allSubmissions[itemIndex].order_item.status.order_item_status.name = action.payload.status;

            if (action.payload.status.toLowerCase() === 'not accepted') {
                state.viewModes[itemIndex].name = 'not_accepted';
            }

            state.viewModes[itemIndex].name = action.payload.status.toLowerCase();
        },
        handleActionNotesInput: (state, action: PayloadAction<{ viewModeIndex: number; notes: string }>) => {
            const viewModeIndex = action.payload.viewModeIndex;
            state.viewModes[viewModeIndex].notes = action.payload.notes;
        },
        resetCardViewMode: (state, action: PayloadAction<{ viewModeIndex: number; topLevelID: number }>) => {
            const viewModeIndex = action.payload.viewModeIndex;
            const itemIndex = state.allSubmissions.findIndex((p: any) => p.id === action.payload.topLevelID);
            const cardStatus = state.allSubmissions[itemIndex].order_item.status.order_item_status.name;

            if (cardStatus.toLowerCase() === 'not accepted') {
                state.viewModes[viewModeIndex] = state.viewModes[viewModeIndex].prevViewMode;
                state.viewModes[viewModeIndex].name = 'not_accepted';
            }

            if (cardStatus.toLowerCase() === 'missing') {
                state.viewModes[viewModeIndex] = state.viewModes[viewModeIndex].prevViewMode;
                state.viewModes[viewModeIndex].name = 'missing';
            }

            if (cardStatus.toLowerCase() === 'confirmed') {
                state.viewModes[viewModeIndex].name = 'confirmed';
            }

            if (cardStatus.toLowerCase() === 'graded') {
                state.viewModes[viewModeIndex].name = 'graded';
                state.allSubmissions[viewModeIndex].humanGradeValues =
                    state.viewModes[viewModeIndex].prevViewModeGraded.humanGradeValues;
            }
        },
        updateCardViewMode: (state, action: PayloadAction<{ viewModeIndex: number; viewModeName: string }>) => {
            const viewModeIndex = action.payload.viewModeIndex;
            const incomingViewModeName = action.payload.viewModeName;

            if (incomingViewModeName === 'not_accepted_pending_notes') {
                state.viewModes[viewModeIndex].prevViewMode = { ...state.viewModes[viewModeIndex], prevViewMode: null };
                state.viewModes[viewModeIndex].sectionTitle = 'Card Not Accepted';
                state.viewModes[viewModeIndex].notesPlaceholder =
                    'Enter notes explaining why this card cannot be accepted';
                state.viewModes[viewModeIndex].areNotesRequired = true;
                state.viewModes[viewModeIndex].name = incomingViewModeName;
            }

            if (incomingViewModeName === 'missing_pending_notes') {
                state.viewModes[viewModeIndex].prevViewMode = { ...state.viewModes[viewModeIndex], prevViewMode: null };
                state.viewModes[viewModeIndex].sectionTitle = 'Card Missing';
                state.viewModes[viewModeIndex].notesPlaceholder = 'Enter notes (if any) about missing card...';
                state.viewModes[viewModeIndex].areNotesRequired = false;
                state.viewModes[viewModeIndex].name = incomingViewModeName;
            }

            if (incomingViewModeName === 'graded_revise_mode') {
                state.viewModes[viewModeIndex].prevViewModeGraded = {
                    ...state.allSubmissions[viewModeIndex],
                    prevViewModeGraded: null,
                };
                state.viewModes[viewModeIndex].name = incomingViewModeName;
            }
        },
        matchExistingOrderItemsToViewModes: (state) => {
            const statuses = [null, 'pending', 'missing', 'not_accepted', 'confirmed', 'graded'];
            function getSectionData(status: string) {
                if (status === 'missing') {
                    return { title: 'Card Missing', placeHolder: 'Enter notes (if any) about missing card...' };
                }

                if (status === 'not_accepted') {
                    return {
                        title: 'Card Not Accepted',
                        placeHolder: 'Enter notes explaining why this card cannot be accepted',
                    };
                }

                return { title: '', placeHolder: '' };
            }
            state.viewModes = state.allSubmissions.map((item: any, index: number) => {
                const status = statuses[item.order_item.status.order_item_status.id];
                return {
                    name: status,
                    areNotesRequired: status === 'not_accepted',
                    sectionTitle: getSectionData(status!)!.title,
                    itemIndex: index,
                    pressedDone: status !== 'confirmed',
                    isDoneDisabled: true,
                    notes: item.order_item.status.notes,
                    notesPlaceholder: getSectionData(status!)!.placeHolder,
                };
            });
        },
    },
    extraReducers: {
        [getAllSubmissions.fulfilled as any]: (state, action) => {
            state.allSubmissions = action.payload;
        },
    },
});

export const {
    updateHumanGradeValue,
    updateExistingCardData,
    updateExistingCardStatus,
    updateCardViewMode,
    handleActionNotesInput,
    matchExistingOrderItemsToViewModes,
    resetCardViewMode,
} = submissionGradesSlice.actions;
