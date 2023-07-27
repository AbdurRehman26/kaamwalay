<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('countries')->whereIn('code', ['US', 'CA'])->update(['phone_code' => '1']);
        DB::table('countries')->where('code', 'AU')->update(['phone_code' => '61']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('countries')->whereIn('code', ['AU', 'CA', 'US'])->update(['phone_code' => null]);
    }
};
