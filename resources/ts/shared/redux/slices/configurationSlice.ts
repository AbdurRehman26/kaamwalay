import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { ConfigurationEntity } from '../../entities/ConfigurationEntity';
import { app } from '../../lib/app';
import { ConfigurationsRepository } from '../../repositories/ConfigurationsRepository';

interface StateType {
    isLoading: boolean;
    error: SerializedError;
    data: ConfigurationEntity;
}

export const loadConfigurationsAction = createAsyncThunk('configuration/load', async () => {
    const configurationsRepository = app(ConfigurationsRepository);
    const data = await configurationsRepository.getConfigurations();

    return instanceToPlain(data) as ConfigurationEntity;
});

interface ConfigSetter<K extends keyof ConfigurationEntity = keyof ConfigurationEntity> {
    key: K;
    value: ConfigurationEntity[K];
}

export const configurationSlice = createSlice({
    name: 'configuration',
    initialState: {
        isLoading: false,
        data: {},
    } as StateType,
    reducers: {
        setConfig: (state, { payload }: PayloadAction<ConfigSetter>) => {
            state.data[payload.key] = payload.value;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loadConfigurationsAction.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadConfigurationsAction.rejected, (state, { error }) => {
                state.error = error;
                state.isLoading = false;
            })
            .addCase(loadConfigurationsAction.fulfilled, (state, { payload }) => {
                state.data = payload;
                state.isLoading = false;
            });
    },
});

export const { setConfig } = configurationSlice.actions;
