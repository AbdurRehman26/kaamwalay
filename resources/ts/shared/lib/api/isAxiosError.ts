import { AxiosError } from 'axios';
import { Exception } from '../../exceptions/Exception';

export function isAxiosError<T>(e: Error | AxiosError<T> | Exception): e is AxiosError<T> {
    return (e as AxiosError).isAxiosError;
}
