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
            $table->string('estimated_delivery_start_date')->nullable()->after('updated_at');
            $table->string('estimated_delivery_end_date')->nullable()->after('estimated_delivery_start_date');
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
            $table->dropColumn('estimated_delivery_start_date');
            $table->dropColumn('estimated_delivery_end_date');
        });
    }
};
