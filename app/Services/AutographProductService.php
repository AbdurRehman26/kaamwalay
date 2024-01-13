<?php

namespace App\Services;

use App\Imports\AutographProductsImport;
use App\Jobs\ProcessImage;
use App\Models\AutographProduct;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AutographProductService
{
    public function import(string $productsFilename, string $imagesDirectory): void
    {
        $this->trackLastAutographProductId();
        $this->processProducts($productsFilename);
        $this->processImages($imagesDirectory);
    }

    protected function processProducts(string $productsFilename): void
    {
        (new AutographProductsImport)->import($productsFilename, 'local', \Maatwebsite\Excel\Excel::CSV);
    }

    protected function trackLastAutographProductId(): void
    {
        Cache::remember(
            'autograph-products-import:last-id',
            now()->addHour(),
            fn () => AutographProduct::latest()->first()->id ?? 0
        );
    }

    protected function processImages(string $imagesDirectory): void
    {
        $autographProducts = AutographProduct::where('id', '>', Cache::get('autograph-products-import:last-id'))->get();
        $autographProducts->each(function (AutographProduct $autographProduct) use ($imagesDirectory) {
            $fileName = "$imagesDirectory/IMG-$autographProduct->certificate_number.jpeg";

            if (Storage::exists($fileName)) {
                $file = Storage::get($fileName);
                Storage::disk('s3')->put('autographs/'.$autographProduct->certificate_number.'.jpg', $file);
                $imageUrl = Storage::disk('s3')->url('autographs/'.$autographProduct->certificate_number.'.jpg');

                $autographProduct->image_url = $imageUrl;
                $autographProduct->save();

                ProcessImage::dispatch($autographProduct, 'image_url', 'autographs', 'jpg', 700, 700, 70)->delay(now()->addSeconds(5));
            }
        });
    }
}
