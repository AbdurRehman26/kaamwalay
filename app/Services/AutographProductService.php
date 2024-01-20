<?php

namespace App\Services;

use App\Imports\AutographProductsImport;
use App\Jobs\ProcessImage;
use App\Models\AutographProduct;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AutographProductService
{
    protected const CLOUD_DIRECTORY = 'autographs';

    /**
     * @throws Exception
     */
    public function importProducts(string $productsFilename): void
    {
        if (! Storage::exists($productsFilename)) {
            throw new Exception('Product file does not exist.');
        }

        (new AutographProductsImport)->import($productsFilename, 'local', \Maatwebsite\Excel\Excel::CSV);
    }

    /**
     * @throws Exception
     */
    public function importImages(string $imagesDirectory, ?string $filesPrefix = null): void
    {
        if (! Storage::exists($imagesDirectory)) {
            throw new Exception('Images directory does not exist.');
        }

        foreach (Storage::files($imagesDirectory) as $image) {
            $certificateNumber = Str::between($image, $filesPrefix, '.');
            $autographProduct = AutographProduct::where('certificate_number', $certificateNumber)->first();

            if ($autographProduct) {
                $cloudFilename = static::CLOUD_DIRECTORY.'/'.$certificateNumber.'.jpg';

                Storage::disk('s3')->put($cloudFilename, Storage::get($image));
                $imageUrl = Storage::disk('s3')->url($cloudFilename);

                $autographProduct->image_url = $imageUrl;
                $autographProduct->save();

                ProcessImage::dispatch($autographProduct, 'image_url', 'autographs', 'jpg', 700, 700, 70)->delay(now()->addSeconds(5));
            }
        }
    }

    public function getDataForPublicPage(AutographProduct $autographProduct): array
    {
        // Random 4 autograph products of the same type as this product
        $relatedItems = $autographProduct->autographType->autographProducts()
            ->inRandomOrder()
            ->take(4)
            ->get(['name', 'certificate_number', 'image_url', 'signed_by'])
            ->transform(function (AutographProduct $autographProduct): AutographProduct {
                $autographProduct['long_name'] = $autographProduct->getLongName();

                return $autographProduct;
            })
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
