import { createSlice } from '@reduxjs/toolkit';
import { CardRarityEntity } from '@shared/entities/CardRarityEntity';
import { RaritiesRepositary } from '@shared/repositories/Admin/RaritiesRepositary';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CardRarityEntity> {}
const adminRaritiesThunk = createRepositoryThunk('adminRarities', RaritiesRepositary);

export const adminRaritiesSlice = createSlice({
    name: adminRaritiesThunk.name,
    initialState: {
        ...adminRaritiesThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminRaritiesThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminRaritiesAction, showAction: showAdminRaritiesAction } = adminRaritiesThunk;
