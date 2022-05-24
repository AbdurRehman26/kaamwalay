<?php

namespace App\Services\Order\Shipping\Calculators;

use App\Services\Order\Shipping\EasyShipService;

class InternationalInsuredShippingFeeCalculator
{
    public static function calculate(int $totalNumberOfItems, array $shippingAddress): float
    {
        $easyShipService = new EasyShipService();

        $originAddress = self::getOriginAddress();
        $destinationAddress = self::buildDestinationAddress($shippingAddress);
        $incoterms = 'DDU';
        $insurance = self::getInsurance();
        $courierSelection = self::getCourierSelection();
        $shippingSettings = self::getShippingSettings();

        $parcels = $easyShipService->calculateParcels($totalNumberOfItems);

        $rates = $easyShipService->requestRates(
            $originAddress,
            $destinationAddress,
            $incoterms,
            $insurance,
            $courierSelection,
            $shippingSettings,
            $parcels
        );

        if (count($rates) > 0) {
            usort($rates, function ($rate1, $rate2) {
                return $rate2->total_charge <=> $rate1->total_charge;
            });

            return $rates[0]->total_charge;
        } else {
            return $easyShipService->calculateDefaultPrice($parcels, $shippingAddress['country_code']);
        }
    }

    protected static function getOriginAddress(): array
    {
        return [
            "line_1" => "727 Page Ave",
            "state" => "NY",
            "city" => "Staten Island",
            "postal_code" => "10307",
            "country_alpha2" => "US",
            "country_name" => "AGS Submissions",
            "contact_phone" => "(347) 850 2720",
        ];
    }

    protected static function buildDestinationAddress(array $shippingAddress): array
    {
        return [
            "line_1" => $shippingAddress['address'],
            "state" => $shippingAddress['state'],
            "city" => $shippingAddress['city'],
            "postal_code" => $shippingAddress['zip'],
            "country_alpha2" => $shippingAddress['country_code'],
            "contact_phone" => $shippingAddress['phone'],
        ];
    }

    protected static function getInsurance(): array
    {
        return [
            "is_insured" => false,
        ];
    }

    protected static function getCourierSelection(): array
    {
        return [
            "apply_shipping_rules" => true,
        ];
    }
    protected static function getShippingSettings(): array
    {
        return [
            "units" => [
                "weight" => "lb",
                "dimensions" => "in",
            ],
        ];
    }
}
