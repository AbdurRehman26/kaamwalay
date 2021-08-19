import { AxiosError } from 'axios';
import { Exception } from '@shared/exceptions/Exception';
import { isAxiosError } from '@shared/lib/api/isAxiosError';
import { isException } from '@shared/lib/errors/isException';

interface CanShowMessage {
    fallbackMessage: string;
    skip(value: string): boolean;
}

const DefaultErrorMessage = 'Internal server error!';

const InvalidErrors: CanShowMessage[] = [
    {
        fallbackMessage: DefaultErrorMessage,
        skip(value): boolean {
            return /^SQLSTATE/i.test(value);
        },
    },
];

export function getErrorMessage(error: Exception | AxiosError, fallbackMessage?: string): string {
    let message = error.message;
    if (isAxiosError(error)) {
        const { data } = error.response || {};
        message = data.message || data.error || message;
    } else if (isException(error)) {
        message = error.detail || message;
    }

    for (const invalidError of InvalidErrors) {
        if (invalidError.skip(message)) {
            message = invalidError.fallbackMessage;
            break;
        }
    }

    return message || fallbackMessage || DefaultErrorMessage;
}
