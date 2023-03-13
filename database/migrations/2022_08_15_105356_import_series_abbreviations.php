<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $pokemonCategory = DB::table('card_categories')->where('name', 'Pokemon')->first();

        $abbreviations = [];

        if ($pokemonCategory) {

            $pokemonEnglishAbbreviations = [
                "Sword & Shield" => "SWSH",
                "Sun & Moon" => "SM",
                "XY" => "XY",
                "Black & White" => "BW",
                "Black & White Promos" => "BW",
                "Call of Legends" => "CALL OF LEGENDS",
                "HeartGold SoulSilver" => "HGSS",
                "Platinum" => "PLATINUM",
                "Nintendo Promos" => "NINTENDO",
                "Diamond & Pearl" => "DP",
                "EX Ruby & Sapphire" => "EX",
                "e-Card" => "E-CARD",
                "Legendary Collection" => "LEGENDARY COLL.",
                "Neo Genesis" => "NEO",
                "Gym Heroes" => "GYM HEROES",
                "Base Set" => "BASE SET"
            ];

            $pokemonJapaneseAbbreviations = [
                "Sword & Shield Era" => "SWSH",
                "Sun & Moon Era" => "SM",
                "XY Era" => "XY",
                "Black & White Era" => "BW",
                "Platinum Era" => "PLATINUM",
                "Neo Era" => "NEO",
                "Original Era" => "OG",
                "Web Era" => "WEB",
                "e-Card Era" => "E-CARD",
                "ADV Era" => "ADV",
                "PCG Era" => "PCG",
                "Diamond & Pearl Era" => "DP",
                "Legend Era" => "LEGEND",
                "Black & White Promos" => "BW-P",
                "Diamond & Pearl Promos" => "DP-P",
                "XY Promos" => "XY-P",
                "Sun & Moon Promos" => "SM-P",
                "Sword & Shield Promos" => "SWSH-P"
            ];

            foreach ($pokemonEnglishAbbreviations as $key => $pokemonEnglishAbbreviation){
                $abbreviations[] = [
                    'card_category_id' => $pokemonCategory->id,
                    'name' => $key,
                    'abbreviation' => $pokemonEnglishAbbreviation,
                    'language' => 'English',
                    'created_at' => now()->toDateString(),
                    'updated_at' => now()->toDateString(),
                ];
            }

            foreach ($pokemonJapaneseAbbreviations as $key => $pokemonJapaneseAbbreviation){
                $abbreviations[] = [
                    'card_category_id' => $pokemonCategory->id,
                    'name' => $key,
                    'abbreviation' => $pokemonJapaneseAbbreviation,
                    'language' => 'Japanese',
                    'created_at' => now()->toDateString(),
                    'updated_at' => now()->toDateString(),
                ];
            }
        }

        $metaZooCategory = DB::table('card_categories')->where('name', 'MetaZoo')->first();

        if($metaZooCategory){

            $metaZooAbbreviations = [
                'Cryptid Nation' => 'CN',
                'Holiday Series' => 'HS'
            ];

            foreach ($metaZooAbbreviations as $key => $metaZooAbbreviation){
                $abbreviations[] = [
                    'card_category_id' => $pokemonCategory->id,
                    'name' => $key,
                    'abbreviation' => $metaZooAbbreviation,
                    'language' => 'English',
                    'created_at' => now()->toDateString(),
                    'updated_at' => now()->toDateString(),
                ];
            }
        }

        DB::table('card_series_abbreviations')->insert($abbreviations);

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
