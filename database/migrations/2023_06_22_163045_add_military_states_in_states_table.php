<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected const STATES_LIST = [
        "AA" => "Armed Forces Central and South Americas (Armed Forces Americas)",
        "AP" => "Armed Forces Pacific",
        "AE" => "Armed Forces Europe (including-Canada, Middle East, and Africa)",
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $now = Carbon::now();

        $data = collect(self::STATES_LIST)->map(function ($name, $code) use ($now) {
            return [
                'code' => $code,
                'name' => $name,
                "created_at" => $now,
                "updated_at" => $now,
            ];
        })->toArray();

        DB::table('states')->insert($data);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('states')->whereIn('code', [
            'AA',
            'AP',
            'AE',
        ])->delete();
    }
};
