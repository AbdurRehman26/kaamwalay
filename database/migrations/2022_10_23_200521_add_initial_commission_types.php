<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected const TABLE = 'commission_types';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table(self::TABLE)->insert([
            [
                'name' => 'Percent of Order Total',
                'type' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fixed Amount Per Card',
                'type' => 1,
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
        DB::table(self::TABLE)->truncate();
    }
};
