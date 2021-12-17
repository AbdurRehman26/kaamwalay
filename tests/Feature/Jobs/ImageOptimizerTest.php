<?php

use App\Jobs\Images\ImageOptimizer;
use App\Models\CardProduct;
use Illuminate\Support\Facades\Storage;

it('can optimize image and update it on server and model', function () {
    Storage::fake('s3');
    $card = CardProduct::factory()->create();

    ImageOptimizer::dispatchSync($card, 'image_path', 'cards', 'jpg', 788, 788, 70);

    $storageCards = Storage::disk('s3')->allFiles('cards');

    expect(count($storageCards))->toEqual(1);
    expect(CardProduct::find($card->id)->image_path)->toEqual(Storage::disk('s3')->url($storageCards[0]));

});
