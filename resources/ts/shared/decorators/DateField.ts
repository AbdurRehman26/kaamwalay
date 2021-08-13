import { Transform } from 'class-transformer';

import { Field } from './Field';

export function DateField(name?: string): PropertyDecorator {
    return (target, propertyName) => {
        Field(name, { type: () => Date })(target, propertyName);

        Transform(
            ({ value }) => {
                if (value instanceof Date) {
                    try {
                        return value.toISOString();
                    } catch (e) {
                        return null;
                    }
                }
                return value;
            },
            { toPlainOnly: true },
        )(target, propertyName);
    };
}
