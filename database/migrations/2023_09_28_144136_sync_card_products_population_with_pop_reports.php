<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('card_products')
            ->join('pop_reports_cards', 'card_products.id', '=', 'pop_reports_cards.card_product_id')
            ->update(['card_products.population' => DB::raw('pop_reports_cards.population')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('card_products')->update([
            'population' => 0,
        ]);
    }
};
