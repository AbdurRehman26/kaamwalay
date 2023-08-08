<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
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
     */
    public function down(): void
    {
        DB::table('referrer_payout_statuses')->truncate();
    }
};
