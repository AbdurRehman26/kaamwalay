<?php

use App\Services\SerialNumberService\CanBeSerialNumbered;
use App\Services\SerialNumberService\SerialNumberService;

it('should generate serial numbers correctly based on normal params', function () {
    $service = new SerialNumberService();

    expect(SerialNumberService::for('TT', 1))->toBe('TT00000001');
    expect(SerialNumberService::for('TT', 1, 4))->toBe('TT0001');
    expect(SerialNumberService::for('customer', 1, 4))->toBe('C0001');
    expect(SerialNumberService::customer(1))->toBe('C00000001');
    expect($service->get('C', 1))->toBe('C00000001');
});

it('should generate serial numbers correctly based on a class', function () {
    class Foo implements CanBeSerialNumbered
    {
        public static function getPrefixSerialNumber(): string
        {
            return  "CC";
        }
    }

    class Bar
    {
    }

    class Bazz
    {
    }

    class FooBarBazFooBarBaz
    {
    }

    expect(SerialNumberService::for(Foo::class, 1))->toBe('CC00000001');
    expect(SerialNumberService::for(Bazz::class, 1))->toBe('B00000001');
    expect(SerialNumberService::for(Bar::class, 1))->toBe('BAR00000001');
    expect(SerialNumberService::for(FooBarBazFooBarBaz::class, 1))->toBe('FBB00000001');
    expect(SerialNumberService::for('test the case subject string match', 1))->toBe('TTC00000001');
});
