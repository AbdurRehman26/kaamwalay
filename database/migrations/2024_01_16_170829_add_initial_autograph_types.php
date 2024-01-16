<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        DB::table('autograph_types')->insert([
            [
                'name' => 'Funko Pop',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Comic/Manga',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Poster',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Toy',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        DB::table('autograph_types')->truncate();
    }
};
