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
        $tcgCategories = [
            'Pokemon',
            'MetaZoo',
            'Dragon Ball Super',
            'YU-GI-OH!',
            'Super Dragon Ball Heroes',
            'Akora',
            'Tasuo Shoedown',
            'Weiss Schwarz',
            'Lost Wonderland',
            'Flesh And Blood',
            'Vanquishers',
            'Back Alley Mages',
            'Dream Book',
            'Otherverse',
            'Otherworld',
            'CannaBeast Gaming',
            'Academy of Arts',
            'Power Cyber',
            'Titan',
            'D-Spirits',
            'Quix Utopia',
            'Final Fantasy',
            'Digimon',
            'Legions Of Will',
            'Ultimate Cards',
            'Gem Blenders',
            'Mythix',
        ];
        $sportCategories = ['Basketball', 'Baseball', 'Football', 'Hockey', 'Soccer', 'UFC'];

        DB::table('card_categories')->whereIn('name', $tcgCategories)->update(['card_category_type_id' => 1]);
        DB::table('card_categories')->whereIn('name', $sportCategories)->update(['card_category_type_id' => 2]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::table('card_categories')->update(['card_category_type_id' => null]);
    }
};
