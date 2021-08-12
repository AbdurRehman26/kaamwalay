interface CurrencyOptions {
    currency?: string;
    format?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

export function formatCurrency(
    value: string | number,
    { currency = 'USD', format = 'en-US', minimumFractionDigits = 2, maximumFractionDigits = 2 }: CurrencyOptions = {},
) {
    let value$ = parseFloat(`${value || 0}`);
    if (Number.isNaN(value$)) {
        value$ = 0;
    }

    const util = new Intl.NumberFormat(format, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
    });

    return util.format(value$);
}
