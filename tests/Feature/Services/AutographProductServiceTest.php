<?php

use App\Imports\AutographProductsImport;
use App\Jobs\ProcessImage;
use App\Models\AutographProduct;
use App\Services\AutographProductService;
use Illuminate\Support\Facades\Bus;

it('imports autograph products', function () {
    Excel::fake();
    Storage::put('test.csv', '');

    (new AutographProductService())->importProducts('test.csv');
    Excel::assertImported('test.csv', 'local', fn (AutographProductsImport $import) => true);
});

it('imports autograph images', function () {
    Storage::fake('local');
    Storage::fake('s3');
    Bus::fake();
    Storage::makeDirectory('test');

    $autographProduct = AutographProduct::factory()->create();
    Storage::put("test/IMG-$autographProduct->certificate_number.jpeg", '');

    (new AutographProductService())->importImages('test', 'IMG-');
    Storage::disk('s3')->assertExists('autographs/'.$autographProduct->certificate_number.'.jpg');
    Bus::assertDispatchedTimes(ProcessImage::class);
});

it('throws exception if product file does not exist', function () {
    Storage::delete('test.csv');

    (new AutographProductService())->importProducts('test.csv');
})->throws(Exception::class);

it('throws exception if images directory does not exist', function () {
    Storage::deleteDirectory('test');

    (new AutographProductService())->importImages('test');
})->throws(Exception::class);

it('returns data for public page', function () {
    AutographProduct::factory()->count(5)->create([
        'autograph_type_id' => 1,
    ]);

    $autographProduct = AutographProduct::first();
    $data = (new AutographProductService())->getDataForPublicPage($autographProduct);

    expect($data['certificate_number'])->toBe($autographProduct->certificate_number)
        ->and($data['long_name'])->toBe($autographProduct->getLongName())
        ->and($data['name'])->toBe($autographProduct->name)
        ->and($data['image_url'])->toBe($autographProduct->image_url)
        ->and($data['category'])->toBe($autographProduct->autographCategory->name)
        ->and($data['type'])->toBe($autographProduct->autographType->name)
        ->and($data['signed_by'])->toBe($autographProduct->signed_by)
        ->and($data['signed_at'])->toBe($autographProduct->signed_at->format('M d, Y'))
        ->and($data['created_at'])->toBe($autographProduct->created_at->format('M d, Y'))
        ->and($data['related_items'])->toHaveCount(4)
        ->and($data['related_items'][0])->toHaveKeys(['long_name', 'image_url', 'certificate_number'])
        ->and(AutographProduct::where('certificate_number',
            $data['related_items'][0]['certificate_number'])->first()->autograph_type_id)->toBe(1);
});
