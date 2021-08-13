import { AxiosError } from 'axios';

export function getErrorsBagArray(error: AxiosError): string[] {
    const { data } = error.response || {};
    const errors: Record<string, string[]> = data.errors || {};

    return Object.values(errors).flat(1);
}
