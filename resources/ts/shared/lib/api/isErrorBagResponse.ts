import { AxiosError } from 'axios';

export function isErrorBagResponse(error: AxiosError) {
    const { data } = error.response || {};
    return !!(data.errors && data.message);
}
