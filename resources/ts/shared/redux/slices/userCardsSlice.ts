import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { app } from '@shared/lib/app';
import { UserCardsRepository } from '@shared/repositories/UserCardsRepository';
import { NotificationsService } from '@shared/services/NotificationsService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<UserCardEntity> {}

const userCardsThunk = createRepositoryThunk('userCards', UserCardsRepository);

export const changeUserCardOwnerShip = createAsyncThunk(
    'changeUserCardOwnerShip',
    async (input: { userCardIds: any; userId: number }, thunkAPI) => {
        const userCardsRepository = app(UserCardsRepository);
        try {
            const newStatusResponse = await userCardsRepository.changeUserCardOwnerShip(input);
            NotificationsService.success('Ownership updated!');
            return newStatusResponse.data;
        } catch (e: any) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const userCardsSlice = createSlice({
    name: userCardsThunk.name,
    initialState: {
        ...userCardsThunk.initialState,
    } as StateType,
    reducers: {
        invalidateUserCards: userCardsThunk.invalidateEntities,
    },
    extraReducers(builder) {
        userCardsThunk.buildReducers(builder);
    },
});
export const { invalidateUserCards } = userCardsSlice.actions;
export const { listAction: listUserCardsAction, showAction: showUserCardAction } = userCardsThunk;
