<?php

namespace Database\Seeders;

use App\Models\CardCategory;
use Illuminate\Contracts\Filesystem\FileExistsException;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class UploadCardCategoriesImages extends Seeder
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
            ['name' => 'Pokemon', 'fileName' => 'Pokemon.png',],
            ['name' => 'MetaZoo', 'fileName' => 'Metazoo.png',],
            ['name' => 'Dragon Ball Super', 'fileName' => 'DragonBall.png',],
            ['name' => 'Yu-Gi-Oh!', 'fileName' => 'Yugioh.png',],
        ];

        foreach ($categories as $category) {
            $this->command->info('Processing ' . $category['name']);

            Storage::disk('s3')->writeStream('platform/categories/' . $category['fileName'], Storage::readStream('public/' . $category['fileName']));
            $url = Storage::disk('s3')->url('platform/categories/' . $category['fileName']);
            $this->command->info('Image uploaded to: ' . $url);

            CardCategory::where('name', 'like', '%' . $category['name'] . '%')->update([
                'image_url' => $url,
            ]);
        }
    }
}
