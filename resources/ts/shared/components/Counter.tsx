import dayjs from 'dayjs';

export function getRemainingTime(timestampMs: any) {
    const timestampDayjs = dayjs(timestampMs);
    const nowDayjs = dayjs();

    let remainingTime = {
        seconds: getRemainingSeconds(nowDayjs, timestampDayjs),
        minutes: getRemainingMinutes(nowDayjs, timestampDayjs),
        hours: getRemainingHours(nowDayjs, timestampDayjs),
    };

    function getRemainingSeconds(nowDayjs: any, timestampDayjs: any) {
        const seconds = timestampDayjs.diff(nowDayjs, 'seconds') % 60;
        return padWithZeros(seconds, 2);
    }

    function getRemainingMinutes(nowDayjs: any, timestampDayjs: any) {
        const minutes = timestampDayjs.diff(nowDayjs, 'minutes') % 60;
        return padWithZeros(minutes, 2);
    }

    function getRemainingHours(nowDayjs: any, timestampDayjs: any) {
        const hours = timestampDayjs.diff(nowDayjs, 'hours') % 24;
        return padWithZeros(hours, 2);
    }

    function padWithZeros(number: any, minLength: any) {
        const numberString = number.toString();
        if (numberString.length >= minLength) {
            return numberString;
        }
        return '0'.repeat(minLength - numberString.length) + numberString;
    }

    if (timestampDayjs.isBefore(nowDayjs)) {
        remainingTime = {
            seconds: '00',
            minutes: '00',
            hours: '00',
        };
    }

    return remainingTime;
}

export default getRemainingTime;
