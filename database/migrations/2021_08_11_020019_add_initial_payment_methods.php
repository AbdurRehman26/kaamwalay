<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
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
     *
     * @return void
     */
    public function down(): void
    {
        DB::table('payment_methods')->truncate();
    }
};
