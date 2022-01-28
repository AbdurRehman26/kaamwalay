<?php

namespace Database\Seeders;

use App\Models\CardCategory;
use Illuminate\Contracts\Filesystem\FileExistsException;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class UploadCardCategoriesImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     * @throws FileExistsException
     * @throws FileNotFoundException
     */
    public function run()
    {
        $categories = [
            ['name' => 'Pokemon', 'url' => 'https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Pokemon.png',],
            ['name' => 'MetaZoo', 'url' => 'https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Metazoo.png',],
            ['name' => 'Dragon Ball Super', 'url' => 'https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/DragonBall.png',],
            ['name' => 'Yu-Gi-Oh!', 'url' => 'https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Yugioh.png',],
        ];

        foreach ($categories as $category) {
            $this->command->info('Processing ' . $category['name']);

            CardCategory::where('name', 'like', '%' . $category['name'] . '%')->update([
                'image_url' => $category['url'],
            ]);
        }
    }
}
