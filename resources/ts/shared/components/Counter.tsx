import moment from 'moment';

export function getRemainingTime(timestampMs: any) {
    const timestamp = moment(timestampMs);
    const nowMoment = moment();

    let remainingTime = {
        seconds: getRemainingSeconds(nowMoment, timestamp),
        minutes: getRemainingMinutes(nowMoment, timestamp),
        hours: getRemainingHours(nowMoment, timestamp),
    };

    function getRemainingSeconds(nowMoment: any, timestamp: any) {
        const seconds = timestamp.diff(nowMoment, 'seconds') % 60;
        return padWithZeros(seconds, 2);
    }

    function getRemainingMinutes(nowMoment: any, timestamp: any) {
        const minutes = timestamp.diff(nowMoment, 'minutes') % 60;
        return padWithZeros(minutes, 2);
    }

    function getRemainingHours(nowMoment: any, timestamp: any) {
        const hours = timestamp.diff(nowMoment, 'hours');
        return padWithZeros(hours, 2);
    }

    function padWithZeros(number: any, minLength: any) {
        const numberString = number.toString();
        if (numberString.length >= minLength) {
            return numberString;
        }
        return '0'.repeat(minLength - numberString.length) + numberString;
    }

    if (timestamp.isBefore(nowMoment)) {
        remainingTime = {
            seconds: '00',
            minutes: '00',
            hours: '00',
        };
    }

    return remainingTime;
}

export default getRemainingTime;
