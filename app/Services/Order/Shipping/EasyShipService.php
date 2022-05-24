<?php

namespace App\Services\Order\Shipping;

use App\Http\APIClients\EasyShipClient;
use Log;

class EasyShipService
{
    protected EasyShipClient $easyShipClient;
    public function __construct()
    {
        $this->easyShipClient = new EasyShipClient();
    }
    // Dimensions are in inches
    // Weights are in pounds

    public const BOX_DIMENSIONS = [
        'length' => 8,
        'height' => 8,
        'width' => 8,
    ];

    public const SLIP_DIMENSIONS = [
        'length' => 6,
        'height' => 10,
        'width' => 1.65, //actually 0.25 but each card slab is 0.35 and can contain up to 4 cards
    ];

    public const BOX_BASE_WEIGHT = 0.25;
    public const SLIP_BASE_WEIGHT = 0.0625;
    public const CARD_BASE_WEIGHT = 0.0625;
    public const MAX_CARDS_PER_SLIP = 4;
    public const MAX_CARDS_PER_BOX = 42;

    public const BOX_DEFAULT_RATE_CANADA = 47.3;
    public const SLIP_DEFAULT_RATE_CANADA = 26.33; //Taken from sample request average
    public const BOX_DEFAULT_RATE_AUSTRALIA = 55.65;
    public const SLIP_DEFAULT_RATE_AUSTRALIA = 24.55; //Taken from sample request average

    public function calculatePackageWeight(int $cardsNumber, int $packageType): float
    {
        if ($packageType === 1) {
            return self::SLIP_BASE_WEIGHT + ($cardsNumber * self::CARD_BASE_WEIGHT);
        }

        return self::BOX_BASE_WEIGHT + ($cardsNumber * self::CARD_BASE_WEIGHT);
    }

    public function calculateParcels(int $cardsNumber): array
    {
        $parcels = [];
        //Type 1 = slip, Type 2 = Box

        $boxesNumber = (int) ($cardsNumber / self::MAX_CARDS_PER_BOX);
        $remainder = $cardsNumber % self::MAX_CARDS_PER_BOX;

        for ($i = 0; $i < $boxesNumber; $i++) {
            $parcels[] = [
                'items' => self::getParcelItems(self::MAX_CARDS_PER_BOX),
                'box' => self::BOX_DIMENSIONS,
                'total_actual_weight' => $this->calculatePackageWeight(self::MAX_CARDS_PER_BOX, 2),
            ];
        }
        if ($remainder > 0) {
            if ($remainder <= self::MAX_CARDS_PER_SLIP) {
                $parcels[] = [
                    'items' => self::getParcelItems($remainder),
                    'box' => self::SLIP_DIMENSIONS,
                    'total_actual_weight' => $this->calculatePackageWeight($remainder, 1),
                ];
            } else {
                $parcels[] = [
                    'items' => self::getParcelItems($remainder),
                    'box' => self::BOX_DIMENSIONS,
                    'total_actual_weight' => $this->calculatePackageWeight($remainder, 2),
                ];
            }
        }


        return $parcels;
    }
    public function requestRates(array $originAddress, array $destinationAddress, string $incoterms, array $insurance, array $courierSelection, array $shippingSettings, array $parcels): array
    {
        Log::debug('Request International Rates, User ID: ' . auth()->user()?->id);
        return $this->easyShipClient->requestRates($originAddress, $destinationAddress, $incoterms, $insurance, $courierSelection, $shippingSettings, $parcels);
    }

    public function calculateDefaultPrice(array $parcels, string $countryCode): float
    {
        $price = 0;

        foreach ($parcels as $parcel) {
            if ($parcel['box'] === self::BOX_DIMENSIONS) {
                $price += self::getBoxDefaultPrice($countryCode);
            } else {
                $price += self::getSlipDefaultPrice($countryCode);
            }
        }

        return $price;
    }

    protected function getBoxDefaultPrice(string $countryCode): float
    {
        if ($countryCode === 'AU') {
            return self::BOX_DEFAULT_RATE_AUSTRALIA;
        }

        return self::BOX_DEFAULT_RATE_CANADA;
    }

    protected function getSlipDefaultPrice(string $countryCode): float
    {
        if ($countryCode === 'AU') {
            return self::SLIP_DEFAULT_RATE_AUSTRALIA;
        }

        return self::SLIP_DEFAULT_RATE_CANADA;
    }

    protected function getParcelItems(int $itemsNumber): array
    {
        return [[
            "quantity" => $itemsNumber,
            "category" => "books_collectibles", //TODO: check if maybe pass category as parameter?
            "description" => "Collectible Card",
            "actual_weight" => self::CARD_BASE_WEIGHT,
            "declared_currency" => "USD",
            "declared_customs_value" => 1, //TODO: Check if we can use total declared value / total declared items instead of hard coded 1
        ]];
    }
}
