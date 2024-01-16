<?php

namespace App\Services;

use App\Imports\AutographProductsImport;
use App\Jobs\ProcessImage;
use App\Models\AutographProduct;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AutographProductService
{
    protected const CLOUD_DIRECTORY = 'autographs';

    /**
     * @throws Exception
     */
    public function import(string $productsFilename, string $imagesDirectory): void
    {
        $this->validateFilesExistence($productsFilename, $imagesDirectory);
        $this->trackLastAutographProductId();
        $this->processProducts($productsFilename);
        $this->processImages($imagesDirectory);
    }

    /**
     * @throws Exception
     */
    protected function validateFilesExistence(string $productsFilename, string $imagesDirectory): void
    {
        if (! Storage::exists($productsFilename)) {
            throw new Exception('Product file does not exist.');
        }

        if (! Storage::exists($imagesDirectory)) {
            throw new Exception('Images directory does not exist.');
        }
    }

    protected function trackLastAutographProductId(): void
    {
        Cache::put(
            'autograph-products-import:last-id',
            AutographProduct::latest()->first()->id ?? 0,
            now()->addHour()
        );
    }

    protected function processProducts(string $productsFilename): void
    {
        (new AutographProductsImport)->import($productsFilename, 'local', \Maatwebsite\Excel\Excel::CSV);
    }

    protected function processImages(string $imagesDirectory): void
    {
        $autographProducts = AutographProduct::where('id', '>', Cache::get('autograph-products-import:last-id'))->get();

        $autographProducts->each(function (AutographProduct $autographProduct) use ($imagesDirectory) {
            $fileName = "$imagesDirectory/IMG-$autographProduct->certificate_number.jpeg";

            if (Storage::exists($fileName)) {
                $cloudFilename = static::CLOUD_DIRECTORY.'/'.$autographProduct->certificate_number.'.jpg';

                Storage::disk('s3')->put($cloudFilename, Storage::get($fileName));
                $imageUrl = Storage::disk('s3')->url($cloudFilename);

                $autographProduct->image_url = $imageUrl;
                $autographProduct->save();

                ProcessImage::dispatch($autographProduct, 'image_url', 'autographs', 'jpg', 700, 700, 70)->delay(now()->addSeconds(5));
            }
        });
    }

    public function getDataForPublicPage(AutographProduct $autographProduct): array
    {
        $relatedItems = $autographProduct->autographType->autographProducts()
            ->inRandomOrder()
            ->take(4)
            ->get(['name', 'certificate_number', 'image_url', 'signed_by'])
            ->transform(fn (AutographProduct $autographProduct) => [
                'long_name' => $autographProduct->getLongName(),
                'certificate_number' => $autographProduct->certificate_number,
                'image_url' => $autographProduct->image_url,
            ])
            ->toArray();

        return [
            'certificate_number' => $autographProduct->certificate_number,
            'long_name' => $autographProduct->getLongName(),
            'name' => $autographProduct->name,
            'image_url' => $autographProduct->image_url,
            'category' => $autographProduct->autographCategory->name,
            'type' => $autographProduct->autographType->name,
            'signed_by' => $autographProduct->signed_by,
            'signed_at' => $autographProduct->signed_at->format('M d, Y'),
            'created_at' => $autographProduct->created_at->format('M d, Y'),
            'related_items' => $relatedItems,
        ];
    }
}
