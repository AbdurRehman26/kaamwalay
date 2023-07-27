<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $australiaId = DB::table('countries')->where('code', 'AU')->first()->id;
        $canadaId = DB::table('countries')->where('code', 'CA')->first()->id;

        $now = Carbon::now()->toDateTimeString();
        DB::table('shipping_matrices')->insert([
            ['country_id' => $australiaId, 'box_default_value' => 55.65, 'slip_default_value' => 24.55, 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => $canadaId, 'box_default_value' => 47.3, 'slip_default_value' => 26.33, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
