import { createSlice } from '@reduxjs/toolkit';
import { CountryEntity } from '@shared/entities/CountryEntity';
import { CountriesRepository } from '@shared/repositories/CountriesRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CountryEntity> {}

const countriesThunk = createRepositoryThunk('countries', CountriesRepository);

export const countrySlice = createSlice({
    name: countriesThunk.name,
    initialState: {
        ...countriesThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        countriesThunk.buildReducers(builder);
    },
});
export const { listAction: listCountriesAction } = countriesThunk;
