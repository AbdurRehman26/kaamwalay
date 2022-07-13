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
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('requires_cleaning')
                ->default(false)
                ->after('salesman_id')
                ->comment('Refers to card cleaning service');
            $table->decimal('cleaning_fee', 10, 2)
                ->after('shipping_fee')
                ->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'requires_cleaning',
                'cleaning_fee',
            ]);
        });
    }
};
