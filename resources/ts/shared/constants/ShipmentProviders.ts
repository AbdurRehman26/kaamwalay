export enum ShipmentProviders {
    Other = 'other',
    UPSP = 'usps',
    UPS = 'ups',
    FedEx = 'fedex',
    DHLExpress = 'dhlexpress',
}

export const ShipmentProvidersList = [
    {
        label: 'United States Postal Service (USPS)',
        value: ShipmentProviders.UPSP,
    },
    {
        label: 'UPS',
        value: ShipmentProviders.UPS,
    },
    {
        label: 'FedEx',
        value: ShipmentProviders.FedEx,
    },
    {
        label: 'DHL Express',
        value: ShipmentProviders.DHLExpress,
    },
    {
        label: 'Other',
        value: ShipmentProviders.Other,
    },
];

/**
 * Check if shipment provider it's a custom provider
 * @param value
 */
export const isCustomShipmentProvider = (value?: ShipmentProviders | string) => {
    return value === ShipmentProviders.Other || !ShipmentProvidersList.find((item) => item.value === value);
};

/**
 * Normalize any value to the right shipment provider
 * @param value
 */
export const getNormalizedShipmentProvider = (value?: any) => {
    if (!value) {
        return ShipmentProvidersList[0].value;
    }

    if (isCustomShipmentProvider(value)) {
        return ShipmentProviders.Other;
    }

    return value;
};
