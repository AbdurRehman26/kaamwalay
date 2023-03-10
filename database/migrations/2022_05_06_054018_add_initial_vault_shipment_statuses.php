<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('vault_shipment_statuses')->insert([
            [
                'code' => 'pending',
                'name' => 'Pending',
                'description' => 'Vault Shipment is Pending',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'shipped',
                'name' => 'Shipped',
                'description' => 'Vault Shipment is Shipped',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'canceled',
                'name' => 'Canceled',
                'description' => 'Vault Shipment is Canceled',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('vault_shipment_statuses')->truncate();
    }
};
