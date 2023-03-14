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
            $table->string('card_reference_id')->nullable()->after('name');
            $table->string('edition')->default('')->after('card_number_order');
            $table->string('surface')->default('')->after('edition');
            $table->string('variant')->default('')->after('surface');
            $table->string('language')->default('English')->after('variant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('card_products', function (Blueprint $table) {
            $table->dropColumn('card_reference_id');
            $table->dropColumn('edition');
            $table->dropColumn('surface');
            $table->dropColumn('variant');
            $table->dropColumn('language');
        });
    }
};
