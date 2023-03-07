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
    public function up(): void
    {
        DB::table('countries')->whereIn('code', ['US', 'CA'])->update(['phone_code' => '1']);
        DB::table('countries')->where('code', 'AU')->update(['phone_code' => '61']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::table('countries')->whereIn('code', ['AU', 'CA', 'US'])->update(['phone_code' => null]);
    }
};
