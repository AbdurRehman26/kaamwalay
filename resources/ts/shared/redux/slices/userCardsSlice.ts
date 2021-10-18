import { createSlice } from '@reduxjs/toolkit';
import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { UserCardsRepository } from '@shared/repositories/UserCardsRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<UserCardEntity> {}

const userCardsThunk = createRepositoryThunk('userCards', UserCardsRepository);

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
