<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Image\Image;
use Spatie\ImageOptimizer\Optimizers\Jpegoptim;

class ImageService
{
    // Set base path where images will be downloaded to
    protected const PATH = 'images/';

    public function process(
        Model $model,
        string $columnName,
        string $directory,
        string $outputExt = 'jpg',
        int $outputWidth = 788,
        int $outputHeight = 788,
        int $outputQuality = 100,
        bool $removeExif = true
    ): void
    {
        // Get Image URL from Model
        $imageUrl = $model->$columnName;

        //Generate Image Name
        $imageName = $this->getImageName();

        // Download file from URL
        $contents = file_get_contents($imageUrl);

        // Set base path where processed images will be saved into
        $outputPath = storage_path('app/' . self::PATH) . 'optimized/';
        // Get image path from source
        $ext = substr($imageUrl, strrpos($imageUrl, '.'));
        // Build full path for downloaded image
        $fullPath = self::PATH . $imageName . $ext;
        // Build full path for optimized image
        $outputFullPath = $outputPath . $imageName . '.' . $outputExt;
        // Build cloud Full Path
        $cloudFullPath = $directory . '/' . $imageName . '.' . $outputExt;

        //Save image in disk
        Storage::put($fullPath, $contents);

        $this->applyOptimizations($fullPath, $outputFullPath, $outputWidth, $outputHeight, $outputQuality, $removeExif);

        $cloudUrl = $this->uploadFileToCloud($imageName, $outputExt, $cloudFullPath);

        $this->updateModel($model, $columnName, $cloudUrl);

        $this->removeOldImages($imageName, $imageUrl, $outputExt, $fullPath);
    }

    protected function getImageName(): string
    {
        return Str::uuid();
    }

    protected function applyOptimizations(string $fullPath, string $outputFullPath, int $outputWidth, int $outputHeight, int $outputQuality, bool $removeExif): void
    {
        // Create optimizations array given parameters
        $optimizations = [];
        if ($removeExif) {
            array_push($optimizations, '--strip-all');
        }

        if ($outputQuality > 0 && $outputQuality < 100) {
            array_push($optimizations, '-m' . $outputQuality);
        }

        // Load image from storage using full path
        $img = Image::load(Storage::path($fullPath));

        // If there are optimizations, include Jpegoptim process
        if (count($optimizations) > 0) {
            $img->optimize([Jpegoptim::class => $optimizations]);
        }
        // Set output width and height and save optimized image to desired location
        $img->width($outputWidth)->height($outputHeight)
            ->save($outputFullPath);
    }

    protected function uploadFileToCloud(string $imageName, string $outputExt, string $cloudFullPath): string
    {
        // Upload image to cloud
        Storage::disk('s3')->writeStream($cloudFullPath, Storage::readStream(self::PATH . 'optimized/' . $imageName . '.' . $outputExt));

        // Get new cloud URL for image and return it
        return Storage::disk('s3')->url($cloudFullPath);
    }

    protected function updateModel(Model $model, string $columnName, string $cloudUrl): void
    {
        // Update model image property
        $model->$columnName = $cloudUrl;
        $model->save();
    }

    protected function removeOldImages(string $imageName, string $imageUrl, string $outputExt, string $fullPath): void
    {
        // Remove cloud original image
        Storage::disk('s3')->delete(str_replace(config('filesystems.disks.s3.endpoint') . '/' . config('filesystems.disks.s3.bucket') . '/', '', $imageUrl));

        // Removed downloaded and optimized image from local disk
        Storage::delete($fullPath);
        Storage::delete(self::PATH . 'optimized/' . $imageName . '.' . $outputExt);
    }
}
