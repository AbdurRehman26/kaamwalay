// Based on this: https://stackoverflow.com/questions/17369098/simplest-way-of-getting-the-number-of-decimals-in-a-number-in-javascript/17369245

export function countDecimals(number: number) {
    if (Math.floor(number) === number) return 0;

    const str = number.toString();
    if (str.indexOf('.') !== -1 && str.indexOf('-') !== -1) {
        return str.split('-')[1] || 0;
    } else if (str.indexOf('.') !== -1) {
        return str.split('.')[1].length || 0;
    }
    return str.split('-')[1] || 0;
}
