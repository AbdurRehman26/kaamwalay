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
        Schema::table('coupons', function (Blueprint $table) {
            $table->tinyInteger('min_threshold_type')
                ->after('capped_amount')
                ->default(0)
                ->comment('0 => No threshold, 1 => card count, 2 => amount');
            $table->integer('min_threshold_value')
                ->after('capped_amount')
                ->default(0)
                ->comment('when 0 it means no threshold');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('coupons', function (Blueprint $table) {
            //
        });
    }
};
