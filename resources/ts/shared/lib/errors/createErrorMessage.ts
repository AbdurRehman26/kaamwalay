import { ErrorMessages } from '@shared/lib/errors/ErrorMessage';

export function createErrorMessage(errorMessage: string | ErrorMessages, ...values: string[]): string {
    return values.reduce((message, value, index) => {
        const key = index + 1;
        return message.replaceAll(`%${key}`, value);
    }, errorMessage);
}

export function createErrorMessageOption(
    errorMessage: string | ErrorMessages,
    ...values: string[]
): { message: string } {
    return { message: createErrorMessage(errorMessage, ...values) };
}
