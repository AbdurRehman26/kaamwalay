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
        $tcgCategories = ['Pokemon', 'MetaZoo', 'Dragon Ball Super', 'YU-GI-OH!', 'Super Dragon Ball Heroes', 'Akora', 'Back Alley Mages', 'Digimon'];
        $sportCategories = ['Basketball', 'Baseball', 'Football', 'Hockey', 'Soccer', 'UFC'];

        DB::table('card_categories')->whereIn('name', $tcgCategories)->update(['type' => 'TCG']);
        DB::table('card_categories')->whereIn('name', $sportCategories)->update(['type' => 'Sports']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('card_categories')->update(['type' => null]);
    }
};
