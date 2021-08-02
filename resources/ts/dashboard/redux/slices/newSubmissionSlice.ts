import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SubmissionService {
    id: number;
    type: 'card';
    protectionLimit: string;
    turnaround: string;
    price: string;
}

export interface Step01Data {
    availableServiceLevels: SubmissionService[];
    selectedServiceLevel: SubmissionService;
    status: any;
}

export type SearchResultItemCardProps = {
    image: string;
    title: string;
    subtitle: string;
    addedMode?: boolean;
    id: number;
    qty?: number;
    value?: number;
};

export interface AddCardsToSubmission {
    searchValue: any;
    searchResults: SearchResultItemCardProps[];
    selectedCards: SearchResultItemCardProps[];
}

export interface NewSubmissionSliceState {
    isNextDisabled: boolean;
    currentStep: number;
    step01Status: any;
    step01Data: Step01Data;
    step02Data: AddCardsToSubmission;
}

const initialState: NewSubmissionSliceState = {
    isNextDisabled: false,
    currentStep: 0,
    step01Status: null,
    step01Data: {
        availableServiceLevels: [],
        selectedServiceLevel: {
            id: 1,
            type: 'card',
            protectionLimit: '$500',
            turnaround: '28-39 Day',
            price: '$20',
        },
        status: null,
    },
    step02Data: {
        searchValue: '',
        searchResults: [],
        selectedCards: [],
    },
};

export const getServiceLevels = createAsyncThunk('newSubmission/getServiceLevels', async () => {
    return fetch('https://run.mocky.io/v3/78b56c6d-fd1b-4140-a1b1-31203dad1a3d').then((res) => res.json());
});

const newSubmissionSlice = createSlice({
    name: 'newSubmission',
    initialState,
    reducers: {
        nextStep: (state) => {
            if (state.currentStep !== 4) {
                state.currentStep += 1;
            }
        },
        backStep: (state) => {
            if (state.currentStep !== 0) {
                state.currentStep -= 1;
            }
        },
        setCustomStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        setAllServiceLevels: (state, action: PayloadAction<SubmissionService[]>) => {
            state.step01Data.availableServiceLevels = action.payload;
        },
        setServiceLevel: (state, action: PayloadAction<SubmissionService>) => {
            state.step01Data.selectedServiceLevel = action.payload;
        },
        setCardsSearchValue: (state, action: PayloadAction<string>) => {
            state.step02Data.searchValue = action.payload;
            // TODO: This will be replaced with search integration
            state.step02Data.searchResults = [
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 1,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 2',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 2,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 3',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 4,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 4',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 5,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 5',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 6,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 6',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 8,
                },
            ];
        },
        markCardAsSelected: (state, action: PayloadAction<SearchResultItemCardProps>) => {
            state.step02Data.selectedCards = [
                ...state.step02Data.selectedCards,
                { ...action.payload, qty: 1, value: 1 },
            ];
        },
        markCardAsUnselected: (state, action: PayloadAction<SearchResultItemCardProps>) => {
            state.step02Data.selectedCards = state.step02Data.selectedCards.filter(
                (cardItem) => cardItem.id !== action.payload.id,
            );
        },
        changeSelectedCardQty: (state, action: PayloadAction<{ card: SearchResultItemCardProps; qty: number }>) => {
            const lookup = state.step02Data.selectedCards.find((card) => card.id == action.payload.card.id);
            if (lookup) {
                lookup.qty = action.payload.qty;
            }
        },
        changeSelectedCardValue: (
            state,
            action: PayloadAction<{ card: SearchResultItemCardProps; newValue: number }>,
        ) => {
            const lookup = state.step02Data.selectedCards.find((card) => card.id == action.payload.card.id);
            if (lookup) {
                lookup.value = action.payload.newValue;
            }
        },
        setIsNextDisabled: (state, action: PayloadAction<boolean>) => {
            state.isNextDisabled = action.payload;
        },
    },
    extraReducers: {
        [getServiceLevels.pending as any]: (state, action) => {
            state.step01Data.status = 'loading';
        },
        [getServiceLevels.fulfilled as any]: (state, action: any) => {
            state.step01Data.availableServiceLevels = action.payload;
            state.step01Data.selectedServiceLevel = action.payload[0];
            state.step01Data.status = 'success';
        },
        [getServiceLevels.rejected as any]: (state, action) => {
            state.step01Data.status = 'failed';
        },
    },
});

export const {
    nextStep,
    backStep,
    setCustomStep,
    setServiceLevel,
    setIsNextDisabled,
    setCardsSearchValue,
    markCardAsSelected,
    markCardAsUnselected,
    changeSelectedCardQty,
    changeSelectedCardValue,
} = newSubmissionSlice.actions;
export default newSubmissionSlice.reducer;