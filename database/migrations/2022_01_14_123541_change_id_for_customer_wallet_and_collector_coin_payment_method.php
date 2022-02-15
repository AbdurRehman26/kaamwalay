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
        Schema::disableForeignKeyConstraints();

        DB::table('payment_methods')->where('code', 'wallet')->update([
            'id' => 5,
        ]);

        DB::table('payment_methods')->where('code', 'collector_coin')->update([
            'id' => 3,
        ]);

        DB::table('payment_methods')->where('code', 'wallet')->update([
            'id' => 4,
        ]);

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
