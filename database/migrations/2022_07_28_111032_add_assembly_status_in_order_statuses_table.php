<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_statuses', function (Blueprint $table) {
            DB::table('order_statuses')->insert([
                [
                    'code' => 'assembled',
                    'name' => 'Assembled',
                    'description' => 'Order is graded and in assembly now.',
                    'order_state_id' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_statuses', function (Blueprint $table) {
            DB::table('order_statuses')->where('code', 'assembled')->delete();
        });
    }
};
