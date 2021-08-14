import { AxiosError } from 'axios';

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

export function getErrorMessage(error: AxiosError): string {
    const { data } = error.response || {};
    let message = data.message || data.error || error.message;

    for (const invalidError of InvalidErrors) {
        if (invalidError.skip(message)) {
            message = invalidError.fallbackMessage;
            break;
        }
    }

    return message || DefaultErrorMessage;
}
