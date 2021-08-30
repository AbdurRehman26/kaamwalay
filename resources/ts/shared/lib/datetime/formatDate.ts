import moment from 'moment';
import { DateLike } from './DateLike';

export function formatDate(date: DateLike, format: string) {
    if (!date) {
        return null;
    }

    return moment(date).format(format);
}
