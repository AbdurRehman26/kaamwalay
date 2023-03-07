<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
        Schema::table('card_products', function (Blueprint $table) {
            $table->string('variant_category')->default('Edition')->after('card_number_order');
            $table->string('variant_name')->default('Unlimited')->after('variant_category');
            $table->string('holo_type')->default('')->after('variant_name');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('card_products', function (Blueprint $table) {
            $table->dropColumn('variant_category');
            $table->dropColumn('variant_name');
            $table->dropColumn('holo_type');
        });
    }
};
