import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { app } from '@shared/lib/app';
import { countDecimals } from '@shared/lib/utils/countDecimals';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

export const getAllSubmissions = createAsyncThunk(
    'submissionGrades/getSubmissionsAndGrades',
    async (DTO: {
        id: number | string;
        fromAgs: boolean | undefined;
        page?: number;
        perPage?: number;
        itemId?: string | null;
    }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(
            `admin/orders/${DTO.id}/grades?per_page=${DTO.perPage}&page=${DTO.page}`,
            { version: 'v3' },
        );
        const cardsResponse = await endpoint.get('', {
            params: {
                fromAgs: DTO.fromAgs,
                filter: {
                    orderItemId: DTO.itemId,
                },
            },
            ...bracketParams(),
        });
        return cardsResponse.data;
    },
);

export const rejectCard = createAsyncThunk(
    'submissionGrades/rejectCard',
    async (DTO: { status: string; notes: string; orderID: number; orderItemID: number }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(
            `admin/orders/${DTO.orderID}/items/${DTO.orderItemID}/change-status`,
        );
        return await endpoint.post('', { status: DTO.status, notes: DTO.notes });
    },
);

export const updateRemoteHumanGrades = createAsyncThunk(
    'submissionGrades/rejectCard',
    async (DTO: { orderID: number; topLevelID: number; humanGradeValues: any; gradeDelta: number }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/orders/${DTO.orderID}/cards/${DTO.topLevelID}/grades`);
        return await endpoint.put('', {
            humanGradeValues: DTO.humanGradeValues,
            gradeDelta: DTO.gradeDelta,
        });
    },
);

export const resendAccessEmail = createAsyncThunk('resendAccessEmail', async (userId: any) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/customers/${userId}/send-access-email`);
    const resendEmail = await endpoint.post('');
    NotificationsService.success('Access email has been sent.');
    return resendEmail;
});

export const markRemoteCardAsGraded = createAsyncThunk(
    'submissionGrades/markRemoteCardAsGraded',
    async (DTO: { status: string; orderID: number; orderItemID: number }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(
            `admin/orders/${DTO.orderID}/items/${DTO.orderItemID}/change-status`,
        );
        return await endpoint.post('', {
            status: DTO.status,
        });
    },
);

export const updateGeneralOrderNotes = createAsyncThunk(
    'submissionGrades/rejectCard',
    async (DTO: { orderID?: number; notes?: string }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/orders/${DTO.orderID}/notes`);
        await endpoint.put('', {
            notes: DTO.notes,
        });
    },
);

export interface SubmissionsGrades {
    allSubmissions: any;
    gradesPagination: any;
    hasLoadedAllRobogrades: boolean;
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
    gradesPagination: null,
    viewModes: [],
    hasLoadedAllRobogrades: true,
};

export const submissionGradesSlice = createSlice({
    name: 'submissionGradesSlice',
    initialState,
    reducers: {
        updateHumanGradeValue: (
            state,
            action: PayloadAction<{ itemIndex: number; side: string; part: string; gradeValue: string }>,
        ) => {
            // Regex Expression to detect if the incoming string contains any letters
            const lettersReg = /[a-zA-Z!@#$%^&*~()_+\-=[\]{};':"\\|,`<>/?]/g;
            let incomingGrade = action.payload.gradeValue;

            if (
                !lettersReg.test(String(incomingGrade)) &&
                countDecimals(Number(incomingGrade.replace(/,/g, '.'))) <= 2
            ) {
                if (Number(incomingGrade) > 10) {
                    incomingGrade = '10';
                }
                state.allSubmissions[action.payload.itemIndex].humanGradeValues[action.payload.side][
                    action.payload.part
                ] = incomingGrade.replace(/,/g, '.');
            }
        },
        updateExistingCardData: (state, action: PayloadAction<{ id: number; data: any }>) => {
            const itemIndex = state.allSubmissions.findIndex((p: any) => p.id === action.payload.id);
            state.allSubmissions[itemIndex] = action.payload.data;
        },
        updateExistingCardStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
            const itemIndex = state.allSubmissions.findIndex((p: any) => p.id === action.payload.id);
            state.allSubmissions[itemIndex].orderItem.status.orderItemStatus.name = action.payload.status;

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
            const cardStatus = state.allSubmissions[itemIndex].orderItem.status.orderItemStatus.name;

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
                state.viewModes[viewModeIndex].areNotesRequired = false;
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
                const status = statuses[item.orderItem.status?.orderItemStatus?.id];
                return {
                    name: status,
                    areNotesRequired: status === 'not_accepted',
                    sectionTitle: getSectionData(status!)!.title,
                    itemIndex: index,
                    pressedDone: status !== 'confirmed',
                    isDoneDisabled: true,
                    notes: item.orderItem.status?.notes,
                    notesPlaceholder: getSectionData(status!)!.placeHolder,
                };
            });
        },
    },
    extraReducers: {
        [getAllSubmissions.fulfilled as any]: (state, action) => {
            const data = action.payload.data;
            const pagination = { links: action.payload.links, meta: action.payload.meta };

            // This API uses a background sync, but as this data is responsible for the whole page items,
            // any change in the state will cause a rerender. To avoid the unnecessary rerendering, we
            // are checking the grades data to ensure if they are loaded, and only then update the state.
            const areGradesLoaded =
                data.filter(
                    (card: Record<string, any>) =>
                        card.roboGradeValues.front?.center && card.roboGradeValues.back?.center,
                ).length === data.length;

            if (
                // This will be true when the API is called first time, and the robogrades are not available.
                (state.hasLoadedAllRobogrades && !areGradesLoaded) ||
                // This will be true when the API is called more than once, and the robogrades are now available.
                (!state.hasLoadedAllRobogrades && areGradesLoaded) ||
                // This will be true when the API is called first time and the grades are available instantly.
                (state.hasLoadedAllRobogrades && areGradesLoaded)
            ) {
                state.allSubmissions = data;
                state.gradesPagination = pagination;
            }
            state.hasLoadedAllRobogrades = areGradesLoaded;
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
