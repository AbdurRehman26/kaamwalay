<?php

use App\Models\CardProduct;
use App\Services\ImageService;
use Illuminate\Support\Facades\Storage;

it('can optimize image and update it on server and model', function () {
    Storage::fake();
    Storage::fake('s3');
    Storage::disk('s3')->put('testCard.jpg', base64_decode('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'));

    $card = CardProduct::factory()->create([
        'image_path' => Storage::disk('s3')->path('testCard.jpg'),
    ]);

    (new ImageService)->process($card, 'image_path', 'cards', 'jpg', 788, 788, 70);

    $storageCards = Storage::disk('s3')->allFiles('cards');

    expect(count($storageCards))->toEqual(1);
    expect(CardProduct::find($card->id)->image_path)->toEqual(Storage::disk('s3')->url($storageCards[0]));
    expect(Storage::allFiles())->toBeEmpty();
});