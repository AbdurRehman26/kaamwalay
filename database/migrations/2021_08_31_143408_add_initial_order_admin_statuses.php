<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInitialOrderAdminStatuses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('order_admin_statuses')->insert([
            [
                'code' => 'pending',
                'name' => 'Pending',
                'description' => 'Order is pending to be reviewed',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'reviewed',
                'name' => 'Reviewed',
                'description' => 'Order has been reviewed',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'graded',
                'name' => 'Graded',
                'description' => 'Order has been graded by us',
                'created_at' => new Datetime(),
                'updated_at' => new Datetime(),
            ],
            [
                'code' => 'shipped',
                'name' => 'Shipped',
                'description' => 'Package has been shipped to customer',
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
        DB::table('order_admin_statuses')->truncate();
    }
}
