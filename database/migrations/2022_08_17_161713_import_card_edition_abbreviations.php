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
        $editionAbbreviations = [
            'Kickstarter' => 'KS',
            '1st Edition' => '1ST ED',
            '2nd Edition' => '2ND ED'
        ];

        foreach ($editionAbbreviations as $key => $abbreviation){
            $abbreviations[] = [
                'name' => $key,
                'abbreviation' => $abbreviation,
                'created_at' => now()->toDateString(),
                'updated_at' => now()->toDateString(),
            ];
        }

        DB::table('card_edition_abbreviations')->insert($abbreviations);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        //
    }
};
