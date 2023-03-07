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
        $now = now();

        DB::table('referrer_payout_statuses')->insert([
            [
                'code' => 'pending',
                'name' => 'Pending',
                'description' => '',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'code' => 'processing',
                'name' => 'Processing',
                'description' => '',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'code' => 'completed',
                'name' => 'Completed',
                'description' => '',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'code' => 'failed',
                'name' => 'Failed',
                'description' => '',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::table('referrer_payout_statuses')->truncate();
    }
};
