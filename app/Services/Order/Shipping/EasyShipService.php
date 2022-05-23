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
//        $response = $this->easyShipClient->requestRates($originAddress, $destinationAddress, $incoterms, $insurance, $courierSelection, $shippingSettings, $parcels);
//        $responseJson = json_decode($response->body());
//        $responseJson = json_decode('{"status":"success","rates":[{"courier_id":"f0e20b4a-40e6-4ca0-8402-4b97dd41cb4a","courier_name":"Global Post - Economy","min_delivery_time":3,"max_delivery_time":6,"value_for_money_rank":1.0,"delivery_time_rank":2.0,"currency":"USD","shipment_charge":34.03,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":34.03,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":34.03,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":3.6,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff","tracking_rating":0,"easyship_rating":5.0,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  3.6 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"Global Post - Economy (3-6 working days) Estimated  3.6 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"86f3875a-a034-4108-b4c3-4646b7490df8","courier_name":"Flat Export","min_delivery_time":6,"max_delivery_time":15,"value_for_money_rank":2.0,"delivery_time_rank":11.0,"currency":"USD","shipment_charge":18.88,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":18.88,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":18.88,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":2.84,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":0,"easyship_rating":3.3,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  2.84 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"Flat Export (6-15 working days) Estimated  2.84 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"2030dd90-a00d-4fec-bc9d-f71e006419c2","courier_name":"DHL - Express Worldwide","min_delivery_time":1,"max_delivery_time":2,"value_for_money_rank":3.0,"delivery_time_rank":1.0,"currency":"USD","shipment_charge":41.17,"fuel_surcharge":6.18,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{"total_fee":0.4,"details":[{"name":"Emergency Situation Surcharge","fee":0.4,"origin_fee":"0.4"}]},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":47.75,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":47.75,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":4.29,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,paid_pickup","tracking_rating":3,"easyship_rating":4.4,"courier_remarks":"For shipping of items subjected to export control to Hong Kong, China, Russia or Venezuela, please state the ECCN or EAR99 in the item description","payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  4.29 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"DHL - Express Worldwide (1-2 working days) Estimated  4.29 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"a4f3a842-c6c0-4e9a-8f7a-a22f34010dc6","courier_name":"Asendia - e-PAQ Standard","min_delivery_time":6,"max_delivery_time":8,"value_for_money_rank":4.0,"delivery_time_rank":3.0,"currency":"USD","shipment_charge":32.69,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{"total_fee":0.76,"details":[{"name":"Covid Surcharge","fee":0.76,"origin_fee":"0.76"}]},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":33.45,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":33.45,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":3.57,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":0,"easyship_rating":1.9,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  3.57 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"Asendia - e-PAQ Standard (6-8 working days) Estimated  3.57 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"f5f20476-e39e-45b9-862e-8106540ca635","courier_name":"USPS - First Class International","min_delivery_time":6,"max_delivery_time":10,"value_for_money_rank":5.0,"delivery_time_rank":6.0,"currency":"USD","shipment_charge":31.97,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":31.97,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":31.97,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":3.5,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":0,"easyship_rating":4.1,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  3.5 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"USPS - First Class International (6-10 working days) Estimated  3.5 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"d5082858-4a51-4beb-9d13-84ec5a47c0ce","courier_name":"Global Post - Standard","min_delivery_time":6,"max_delivery_time":10,"value_for_money_rank":6.0,"delivery_time_rank":7.0,"currency":"USD","shipment_charge":35.13,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":35.13,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":35.13,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":3.66,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff","tracking_rating":0,"easyship_rating":1.3,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  3.66 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"Global Post - Standard (6-10 working days) Estimated  3.66 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"392b5504-5a44-45ab-8553-382c0855272c","courier_name":"RRD - Priority Parcel","min_delivery_time":9,"max_delivery_time":12,"value_for_money_rank":7.0,"delivery_time_rank":10.0,"currency":"USD","shipment_charge":29.9,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":29.9,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":29.9,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":3.4,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":1,"easyship_rating":3.6,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  3.4 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"RRD - Priority Parcel (9-12 working days) Estimated  3.4 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"a9f1bec4-1ec6-4dc6-9989-2d362ec6f3a2","courier_name":"Asendia - e-PAQ Plus","min_delivery_time":7,"max_delivery_time":11,"value_for_money_rank":8.0,"delivery_time_rank":8.0,"currency":"USD","shipment_charge":34.02,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{"total_fee":0.76,"details":[{"name":"Covid Surcharge","fee":0.76,"origin_fee":"0.76"}]},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":34.78,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":34.78,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":3.64,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":2,"easyship_rating":3.4,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  3.64 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"Asendia - e-PAQ Plus (7-11 working days) Estimated  3.64 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"26523a3e-4e17-4961-bb23-fd032d43f2d8","courier_name":"USPS - Priority Mail International","min_delivery_time":7,"max_delivery_time":12,"value_for_money_rank":9.0,"delivery_time_rank":9.0,"currency":"USD","shipment_charge":43.4,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":43.4,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":43.4,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":4.07,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":1,"easyship_rating":3.8,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  4.07 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"USPS - Priority Mail International (7-12 working days) Estimated  4.07 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"dd77fa21-efcb-4bb9-9637-e3687aacc616","courier_name":"Asendia - Epaq Select","min_delivery_time":4,"max_delivery_time":9,"value_for_money_rank":10.0,"delivery_time_rank":4.0,"currency":"USD","shipment_charge":51.65,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{"total_fee":1.16,"details":[{"name":"Covid Surcharge","fee":1.16,"origin_fee":"1.16"}]},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":52.81,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":52.81,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":4.54,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":0,"easyship_rating":1.9,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  4.54 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"Asendia - Epaq Select (4-9 working days) Estimated  4.54 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"2af61bb3-06c0-4e6e-8b82-3b9cf8722275","courier_name":"USPS - Priority Mail Express International","min_delivery_time":6,"max_delivery_time":9,"value_for_money_rank":11.0,"delivery_time_rank":5.0,"currency":"USD","shipment_charge":59.36,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":59.36,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":59.36,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":4.87,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":2,"easyship_rating":3.5,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  4.87 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"USPS - Priority Mail Express International (6-9 working days) Estimated  4.87 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"a9e55850-525e-4a31-a714-88c2f562c22d","courier_name":"RRD - Priority Packet","min_delivery_time":10,"max_delivery_time":20,"value_for_money_rank":12.0,"delivery_time_rank":14.0,"currency":"USD","shipment_charge":43.99,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":43.99,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":43.99,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":4.1,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":1,"easyship_rating":5.0,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  4.1 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"RRD - Priority Packet (10-20 working days) Estimated  4.1 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"1422eb90-f90a-4afa-a7b2-83657ee54582","courier_name":"FedEx Cross Border Untracked","min_delivery_time":10,"max_delivery_time":20,"value_for_money_rank":13.0,"delivery_time_rank":15.0,"currency":"USD","shipment_charge":48.27,"fuel_surcharge":0.0,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":48.27,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":48.27,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":4.31,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":0,"easyship_rating":2.9,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  4.31 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"FedEx Cross Border Untracked (10-20 working days) Estimated  4.31 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"b77a8d13-274d-4f8b-8aeb-ceb0cae1d9d5","courier_name":"Aramex - Economy Express ORD","min_delivery_time":10,"max_delivery_time":15,"value_for_money_rank":14.0,"delivery_time_rank":12.0,"currency":"USD","shipment_charge":80.39,"fuel_surcharge":12.06,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":92.45,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":92.45,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":6.52,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":2,"easyship_rating":3.3,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  6.52 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"Aramex - Economy Express ORD (10-15 working days) Estimated  6.52 tax \u0026 duty due on delivery (Tax handling fees may apply)"},{"courier_id":"3da5e847-c889-46c2-aaac-ec6d6f70f5c0","courier_name":"Aramex - Parcel","min_delivery_time":10,"max_delivery_time":15,"value_for_money_rank":15.0,"delivery_time_rank":13.0,"currency":"USD","shipment_charge":82.63,"fuel_surcharge":12.39,"remote_area_surcharge":0.0,"remote_area_surcharges":{},"other_surcharges":{"total_fee":3.75,"details":[{"name":"Covid Surcharge","fee":3.75,"origin_fee":"3.75"}]},"oversized_surcharge":0.0,"additional_services_surcharge":0.0,"residential_full_fee":0.0,"residential_discounted_fee":0.0,"shipment_charge_total":98.77,"warehouse_handling_fee":0.0,"insurance_fee":0.0,"sales_tax":0.0,"provincial_sales_tax":0.0,"ddp_handling_fee":0.0,"import_tax_charge":0.0,"import_tax_non_chargeable":0.0,"import_duty_charge":0.0,"total_charge":98.77,"is_above_threshold":true,"incoterms":"DDU","estimated_import_tax":6.84,"estimated_import_duty":0.0,"minimum_pickup_fee":0.0,"available_handover_options":"dropoff,free_pickup","tracking_rating":2,"easyship_rating":4.6,"courier_remarks":null,"payment_recipient":"Easyship","discount":{"amount":0,"code":null,"percentage":null,"expires_at":null,"origin_amount":0},"description":"Estimated  6.84 tax \u0026 duty due on delivery (Tax handling fees may apply)","full_description":"Aramex - Parcel (10-15 working days) Estimated  6.84 tax \u0026 duty due on delivery (Tax handling fees may apply)"}]}');
//        $responseJson = json_decode('{"error":"User doesn\'t have permissions for this request"}');

        $responseJson = json_decode('{"status":"failure","errors":["Sorry, we couldn\'t find any shipping solutions based on the information provided."],"request_id":"0300ec1b-5f9a-4087-9869-d626d6cc5dee","timestamp":"2022-05-23T19:40:15.162Z"}');

        if (isset($responseJson->error)) {
            Log::debug('Failed with error: ' . $responseJson->error);

            return [];
        }

        if (isset($responseJson->status) && $responseJson->status === 'failure') {
            Log::debug('Failed with errors: ', $responseJson->errors);

            return [];
        }

        return $responseJson->rates;
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
