<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('order_item_statuses')->insert([
            [
                'code' => 'cancelled',
                'name' => 'Cancelled',
                'description' => 'Item is cancelled by the user',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('order_item_statuses')->where('code', 'cancelled')->delete();
    }
};
