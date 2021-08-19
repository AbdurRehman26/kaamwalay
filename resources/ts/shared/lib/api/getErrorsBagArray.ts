import { AxiosError } from 'axios';
import { ValidationError } from 'class-validator';
import { Exception } from '@shared/exceptions/Exception';
import { ValidationException } from '@shared/exceptions/ValidationException';
import { isAxiosError } from '@shared/lib/api/isAxiosError';
import { isException } from '@shared/lib/errors/isException';

function getErrorConstraints(error: ValidationError): string[] {
    const constraints = error.constraints ?? {};
    return Object.values(constraints);
}

export function getErrorsBagArray(error: Exception | AxiosError): string[] {
    let errors: string[] = [];
    if (isException(error) && error instanceof ValidationException) {
        errors = error.errors.reduce((prev, error) => {
            return [...prev, ...getErrorConstraints(error)];
        }, [] as string[]);
    } else if (isAxiosError(error)) {
        const { data } = error.response || {};
        errors = Object.values(data.errors || {});
    }

    return errors.flat(1);
}
