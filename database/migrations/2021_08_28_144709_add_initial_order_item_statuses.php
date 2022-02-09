<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
                'code' => 'pending',
                'name' => 'Pending',
                'description' => 'Item is pending to be reviewed',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'missing',
                'name' => 'Missing',
                'description' => 'Item is not present in the shipped box',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'not_accepted',
                'name' => 'Not Accepted',
                'description' => 'Item is not a valid card to be graded',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'confirmed',
                'name' => 'Confirmed',
                'description' => 'Item is present in the shipped box and will be graded',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'graded',
                'name' => 'Graded',
                'description' => 'Item has been graded by us',
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
        DB::table('order_item_statuses')->truncate();
    }
};
