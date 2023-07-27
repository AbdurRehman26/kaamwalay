<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('countries')->insert([
            [
                'code' => 'US',
                'name' => 'United States',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('countries')->truncate();
    }
};
