import { AxiosError } from 'axios';
import { Exception } from '@shared/exceptions/Exception';
import { ValidationException } from '@shared/exceptions/ValidationException';
import { isAxiosError } from '@shared/lib/api/isAxiosError';
import { isException } from '@shared/lib/errors/isException';

export function isErrorBagResponse(error: Exception | AxiosError) {
    if (isAxiosError(error)) {
        const { data } = error.response || {};
        return !!(data.errors && data.message);
    }

    return isException(error) && error instanceof ValidationException;
}
