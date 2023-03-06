import { createSlice } from '@reduxjs/toolkit';
import { CardRarityEntity } from '@shared/entities/CardRarityEntity';
import { SurfacesRepositary } from '@shared/repositories/Admin/SurfacesRepositary';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CardRarityEntity> {}
const adminSurfacesThunk = createRepositoryThunk('adminSurfaces', SurfacesRepositary);

export const adminSurfacesSlice = createSlice({
    name: adminSurfacesThunk.name,
    initialState: {
        ...adminSurfacesThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminSurfacesThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminSurfacesAction, showAction: showAdminSurfacesAction } = adminSurfacesThunk;
