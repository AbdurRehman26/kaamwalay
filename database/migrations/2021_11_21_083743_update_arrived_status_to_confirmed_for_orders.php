<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('order_statuses')
            ->where('code', 'arrived')
            ->update([
                'code' => 'confirmed',
                'name' => 'Confirmed',
                'description' => 'Order is confirmed.',
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
