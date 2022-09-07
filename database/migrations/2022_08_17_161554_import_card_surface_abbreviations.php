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
    public function up()
    {
        $surfaceAbbreviations = [
            'Holo' => 'HOLO',
            'Cracked Ice Holo' => 'CI.HOLO',
            'Cosmos Holo' => 'C.HOLO',
            'Reverse Holo' => 'REV.HOLO',
            'Reverse Foil' => 'REV.FOIL',
            'Cracked Ice Reverse Holo' => 'CI REV.HOLO',
            'Sheen Holo' => 'SHEEN HOLO',
            'Mirror Holo' => 'MIR.HOLO',
            'Tinsel Holo' => 'TNSL.HOLO',
            'Speckle Holo' => 'SPKLE.HOLO',
            'Sparkle Holo' => 'SPRKL.HOLO',
            'Crosshatch Holo' => 'XHTCH.HOLO'
        ];

        foreach ($surfaceAbbreviations as $key => $abbreviation){
            $abbreviations[] = [
                'name' => $key,
                'abbreviation' => $abbreviation,
                'created_at' => now()->toDateString(),
                'updated_at' => now()->toDateString(),
            ];
        }

        DB::table('card_surface_abbreviations')->insert($abbreviations);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
