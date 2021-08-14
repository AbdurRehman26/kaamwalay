import moment, { Moment } from 'moment';

export function formatDate(date: Moment | Date | string, format: string) {
    if (!date) {
        return null;
    }

    return moment(date).format(format);
}
