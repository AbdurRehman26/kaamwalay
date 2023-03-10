<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('card_products')->where('variant_name', '!=', 'Reverse Holo')->update([
            'edition' => DB::raw('variant_name'),
        ]);

        DB::table('card_products')->where('variant_name', '=', 'Reverse Holo')->update([
            'surface' => DB::raw('variant_name'),
            'edition' => 'Unlimited',
        ]);

        DB::table('card_products')->where('holo_type', '=', 'HOLO')->update([
            'surface' => 'Holo',
        ]);

        DB::table('card_products')->where('holo_type', '=', 'REV.HOLO')->update([
            'surface' => 'Reverse Holo',
        ]);

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('card_products', function (Blueprint $table) {
            //
        });
    }
};
