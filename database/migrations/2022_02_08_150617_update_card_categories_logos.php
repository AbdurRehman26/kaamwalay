<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $categories = [
            ['name' => 'Pokemon', 'url' => 'https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Pokemon.png',],
            ['name' => 'MetaZoo', 'url' => 'https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Metazoo.png',],
            ['name' => 'Dragon Ball Super', 'url' => 'https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/DragonBall.png',],
            ['name' => 'YU-GI-OH!', 'url' => 'https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Yugioh.png',],
        ];

        foreach ($categories as $category) {

            DB::table('card_categories')->where('name', 'like', '%' . $category['name'] . '%')->update([
                'image_url' => $category['url'],
            ]);
        }
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
