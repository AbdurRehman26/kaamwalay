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
    public function up()
    {
        Schema::table('payment_plans', function (Blueprint $table) {
            $table->decimal('price_before_discount', 10)->nullable()->after('price')->comment('It can be used to show a pre-discount price.');
            $table->string('discount_percentage')->after('price_before_discount')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payment_plans', function (Blueprint $table) {
            $table->dropColumn('price_before_discount');
            $table->dropColumn('discount_percentage');
        });
    }
};
