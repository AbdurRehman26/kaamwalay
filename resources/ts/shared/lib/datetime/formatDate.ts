import moment, { Moment } from 'moment';

export function formatDate(date: Moment | Date | string, format: string) {
    return moment(date).format(format);
}
