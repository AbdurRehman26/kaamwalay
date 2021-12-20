<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Image\Image;
use Spatie\ImageOptimizer\Optimizers\Jpegoptim;

class ProcessImageService
{
    public function process(
        Model $model,
        string $columnName,
        string $s3Folder,
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

        // Set base path where images will be downloaded to
        $path = 'public/images/';
        // Set base path where processed images will be saved into
        $outputPath = storage_path('app/' . $path) . 'optimized/';
        // Get image path from source
        $ext = substr($imageUrl, strrpos($imageUrl, '.'));
        // Build full path for downloaded image
        $fullPath = $path . $imageName . $ext;
        // Build full path for optimized image
        $outputFullPath = $outputPath . $imageName . '.' . $outputExt;
        // Build S3 Full Path
        $s3FullPath = $s3Folder . '/' . $imageName . '.' . $outputExt;

        //Save image in disk
        Storage::put($fullPath, $contents);

        $this->applyOptimizations($fullPath, $outputFullPath, $outputWidth, $outputHeight, $outputQuality, $removeExif);

        $s3Url = $this->uploadFileToS3($imageName, $outputExt, $path, $s3FullPath);

        $this->updateModel($model, $columnName, $s3Url);

        $this->removeOldImages($imageName, $imageUrl, $outputExt, $path, $fullPath);
    }

    protected function getImageName(): string
    {
        return Str::uuid();
    }

    protected function applyOptimizations(string $fullPath, string $outputFullPath, int $outputWidth, int $outputHeight, int $outputQuality, bool $removeExif){
        // Create optimizations array given parameters
        $optimizations = [];
        if ($removeExif) {
            array_push($optimizations, '--strip-all');
        }

        if ($outputQuality < 100 && $outputQuality > 0) {
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

    protected function uploadFileToS3(string $imageName, string $outputExt, string $path, string $s3FullPath): string
    {

        // Upload image to S3
        Storage::disk('s3')->writeStream($s3FullPath, Storage::readStream($path . 'optimized/' . $imageName . '.' . $outputExt));

        // Get new S3 URL for image and return it
        return Storage::disk('s3')->url($s3FullPath);
    }

    protected function updateModel(Model $model, string $columnName, string $s3Url): void
    {
        // Update model image property
        $model->$columnName = $s3Url;
        $model->save();
    }

    protected function removeOldImages(string $imageName, string $imageUrl, string $outputExt, string $path, string $fullPath): void
    {
        // Remove S3 original image
        Storage::disk('s3')->delete(str_replace(config('filesystems.disks.s3.endpoint') . '/' . config('filesystems.disks.s3.bucket') . '/', '', $imageUrl));

        // Removed downloaded and optimized image from local disk
        Storage::delete($fullPath);
        Storage::delete($path . 'optimized/' . $imageName . '.' . $outputExt);
    }
}
