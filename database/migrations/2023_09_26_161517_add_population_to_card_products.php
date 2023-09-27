<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('card_products', function (Blueprint $table) {
            $table->unsignedInteger('population')->default(0)->after('description');
        });

        DB::statement('ALTER TABLE card_products ADD INDEX card_products_population_index (population DESC)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('card_products', function (Blueprint $table) {
            $table->dropIndex('card_products_population_index');
            $table->dropColumn('population');
        });
    }
};
