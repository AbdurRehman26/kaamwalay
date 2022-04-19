import { createSlice } from '@reduxjs/toolkit';
import { VaultShipmentEntity } from '@shared/entities/VaultShipmentEntity';
import { VaultShipmentsRepository } from '@shared/repositories/VaultShipmentsRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<VaultShipmentEntity> {}

const vaultShipmentsThunk = createRepositoryThunk('vaultShipments', VaultShipmentsRepository);

export const vaultShipmentsSlice = createSlice({
    name: vaultShipmentsThunk.name,
    initialState: {
        ...vaultShipmentsThunk.initialState,
    } as StateType,
    reducers: {
        invalidateVaultShipments: vaultShipmentsThunk.invalidateEntities,
    },
    extraReducers(builder) {
        vaultShipmentsThunk.buildReducers(builder);
    },
});
export const { invalidateVaultShipments } = vaultShipmentsSlice.actions;
export const { listAction: listVaultShipmentsAction, showAction: showVaultShipmentAction } = vaultShipmentsThunk;
