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
        DB::table('countries')->where('code', 'US')->update([
            'is_enabled' => true,
            'updated_at' => Carbon::now()->toDateTimeString(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('countries')->where('code', 'US')->update([
            'is_enabled' => false,
        ]);
    }
};
