import { ShipmentProviders, isCustomShipmentProvider } from './ShipmentProviders';

describe('constants/SharedProviders', function () {
    it('should correctly check the custom provider', function () {
        expect(isCustomShipmentProvider('foo')).toBeTruthy();
        expect(isCustomShipmentProvider(ShipmentProviders.Other)).toBeTruthy();
        expect(isCustomShipmentProvider(ShipmentProviders.DHLExpress)).toBeFalsy();
        expect(isCustomShipmentProvider(ShipmentProviders.FedEx)).toBeFalsy();
        expect(isCustomShipmentProvider(ShipmentProviders.UPSP)).toBeFalsy();
        expect(isCustomShipmentProvider(ShipmentProviders.UPS)).toBeFalsy();
    });
});
