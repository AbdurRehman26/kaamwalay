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
        DB::table('commission_structures')->insert([
            [
                'level' => 1,
                'fixed_value_per_card' => 1,
                'percentage_value' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'level' => 2,
                'fixed_value_per_card' => 1,
                'percentage_value' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'level' => 3,
                'fixed_value_per_card' => 1,
                'percentage_value' => 0.1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'level' => 4,
                'fixed_value_per_card' => 1,
                'percentage_value' => 0.01,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'level' => 5,
                'fixed_value_per_card' => 1,
                'percentage_value' => 0.001,
                'created_at' => now(),
                'updated_at' => now(),
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
        DB::table('commission_structures')->truncate();
    }
};
