import { Transform, TransformationType } from 'class-transformer';
import moment, { isMoment, Moment } from 'moment';

export function DateField(): PropertyDecorator {
    return (target, propertyName) => {
        Transform(({ value, type }) => {
            if (!value) {
                return null;
            }

            if (type === TransformationType.CLASS_TO_PLAIN) {
                try {
                    if (value instanceof Date) {
                        return value.toISOString();
                    } else if (value && isMoment(value)) {
                        return (value as Moment).toISOString();
                    }
                } catch (error: any) {
                    return null;
                }
            } else if (type === TransformationType.PLAIN_TO_CLASS) {
                const date = typeof value === 'string' ? new Date(value) : value;
                return moment(date);
            }

            return value;
        })(target, propertyName);
    };
}
