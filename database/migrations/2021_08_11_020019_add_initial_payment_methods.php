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
        DB::table('payment_methods')->insert([
            [
                'code' => 'stripe',
                'name' => 'Credit or Debit Card',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
            [
                'code' => 'paypal',
                'name' => 'Paypal',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('payment_methods')->truncate();
    }
};
