<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        DB::table('autograph_categories')->insert([
            'name' => 'Collectibles & Art',
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function down(): void
    {
        DB::table('autograph_categories')->truncate();
    }
};
