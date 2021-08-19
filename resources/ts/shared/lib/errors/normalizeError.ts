import { miniSerializeError } from '@reduxjs/toolkit';
import { getErrorMessage } from '@shared/lib/api/getErrorMessage';
import { isAxiosError } from '@shared/lib/api/isAxiosError';
import { isException } from '@shared/lib/errors/isException';
import { toJS } from '@shared/lib/strings/toJS';

export function normalizeError(error: any): Record<string, any> {
    if (isAxiosError(error)) {
        return {
            config: toJS(error.config),
            response: toJS(error.response),
            request: toJS(error.request),
            message: getErrorMessage(error),
        };
    }

    if (isException(error)) {
        return toJS(error);
    }

    return miniSerializeError(error);
}
