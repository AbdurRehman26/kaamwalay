import { Injectable } from '../decorators/Injectable';
import { CountryEntity } from '../entities/CountryEntity';
import { Repository } from './Repository';

@Injectable('CountryRepository')
export class CountriesRepository extends Repository<CountryEntity> {
    readonly endpointPath: string = 'customer/addresses/countries';
    readonly model = CountryEntity;
}
