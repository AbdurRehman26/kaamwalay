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
        DB::table('order_item_statuses')->insert([
            [
                'code' => 'cancelled',
                'name' => 'Cancelled',
                'description' => 'Item is cancelled byt the user',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('order_item_statuses')->where('code', 'cancelled')->delete();
    }
};
