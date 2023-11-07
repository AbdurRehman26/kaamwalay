<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('payment_methods')->insert([
            [
                'id' => 7,
                'code' => 'stripe_affirm',
                'name' => 'Affirm',
                'is_visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('payment_methods')
            ->where('code', 'stripe_affirm')
            ->delete();
    }
};
