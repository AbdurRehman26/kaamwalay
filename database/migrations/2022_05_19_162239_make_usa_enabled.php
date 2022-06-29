<?php

use Illuminate\Database\Migrations\Migration;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('countries')->where('code', 'US')->update([
            'is_enabled' => true,
            'updated_at' => Carbon::now()->toDateTimeString(),
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('countries')->where('code', 'US')->update([
            'is_enabled' => false,
        ]);
    }
};
