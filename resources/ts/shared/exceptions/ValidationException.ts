import { ValidationError } from 'class-validator';
import { Exception } from './Exception';

export class ValidationException extends Exception {
    public errors!: ValidationError[];
    constructor(index: number, propertyKey: string | symbol, name: string, errors: ValidationError[]) {
        super(
            `Failed to validate argument '${index}' of method '${String(propertyKey)}' of class '${name}'.`,
            'Validation errors!',
        );

        this.errors = errors;
    }
}
