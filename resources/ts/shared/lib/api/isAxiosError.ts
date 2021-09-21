import { AxiosError } from 'axios';

export function isAxiosError<T>(e: Error | AxiosError<T>): e is AxiosError<T> {
    return (e as AxiosError).isAxiosError;
}
