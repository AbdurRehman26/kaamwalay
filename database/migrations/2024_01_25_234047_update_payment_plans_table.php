<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $newPricing = [
            [
                'id' => 1,
                'price' => 14,
                'max_protection_amount' => 100,
                'turnaround' => '20 Business Days',
                'estimated_delivery_days_min' => 20,
                'estimated_delivery_days_max' => 20,
                'display_position' => 1,
            ],
            [
                'id' => 2,
                'price' => 20,
                'max_protection_amount' => 200,
                'turnaround' => '5 Business Days',
                'estimated_delivery_days_min' => 5,
                'estimated_delivery_days_max' => 5,
                'display_position' => 2,
            ],
            [
                'id' => 3,
                'price' => 30,
                'max_protection_amount' => 500,
                'turnaround' => '5 Business Days',
                'estimated_delivery_days_min' => 5,
                'estimated_delivery_days_max' => 5,
                'display_position' => 3,
            ],
            [
                'id' => 4,
                'price' => 50,
                'max_protection_amount' => 1000,
                'turnaround' => '2-3 Business Days',
                'estimated_delivery_days_min' => 2,
                'estimated_delivery_days_max' => 3,
                'display_position' => 4,
            ],
            [
                'id' => 5,
                'price' => 75,
                'max_protection_amount' => 2000,
                'turnaround' => '1 Business Day',
                'estimated_delivery_days_min' => 1,
                'estimated_delivery_days_max' => 1,
                'display_position' => 5,
            ],
        ];

        DB::table('payment_plans')->upsert($newPricing, ['id'], ['price', 'max_protection_amount', 'turnaround', 'estimated_delivery_days_min', 'estimated_delivery_days_max']);
    }

    public function down(): void
    {
        $newPricing = [
            [
                'id' => 1,
                'price' => 14,
                'max_protection_amount' => 100,
                'turnaround' => '30 Business Days',
                'estimated_delivery_days_min' => 30,
                'estimated_delivery_days_max' => 30,
                'display_position' => 1,
            ],
            [
                'id' => 2,
                'price' => 20,
                'max_protection_amount' => 200,
                'turnaround' => '20 Business Days',
                'estimated_delivery_days_min' => 20,
                'estimated_delivery_days_max' => 20,
                'display_position' => 2,
            ],
            [
                'id' => 3,
                'price' => 30,
                'max_protection_amount' => 500,
                'turnaround' => '10 Business Days',
                'estimated_delivery_days_min' => 10,
                'estimated_delivery_days_max' => 10,
                'display_position' => 3,
            ],
            [
                'id' => 4,
                'price' => 50,
                'max_protection_amount' => 1000,
                'turnaround' => '4-6 Business Days',
                'estimated_delivery_days_min' => 4,
                'estimated_delivery_days_max' => 6,
                'display_position' => 4,
            ],
            [
                'id' => 5,
                'price' => 75,
                'max_protection_amount' => 2000,
                'turnaround' => '2 Business Days',
                'estimated_delivery_days_min' => 2,
                'estimated_delivery_days_max' => 2,
                'display_position' => 5,
            ],
        ];

        DB::table('payment_plans')->upsert($newPricing, ['id'], ['price', 'max_protection_amount', 'turnaround', 'estimated_delivery_days_min', 'estimated_delivery_days_max']);
    }
};
