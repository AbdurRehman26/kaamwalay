import { AxiosRequestConfig } from 'axios';
import { CountryEntity } from '../../entities/CountryEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { listCountriesAction } from '../slices/countrySlice';

export function useCountriesListsQuery(config?: AxiosRequestConfig) {
    return useListQuery(listCountriesAction, CountryEntity, (state) => state.countries, config);
}
