<?php

namespace App\Services;

use Illuminate\Contracts\Filesystem\FileExistsException;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Image\Exceptions\InvalidManipulation;
use Spatie\Image\Image;
use Spatie\ImageOptimizer\Optimizers\Jpegoptim;

class ImageService
{
    // Set base path where images will be downloaded to
    protected const TEMPORARY_FILE_PATH = 'images/';

    /**
     * @param  Model  $model
     * @param  string  $columnName
     * @param  string  $directory
     * @param  string  $outputExt
     * @param  int  $outputWidth
     * @param  int  $outputHeight
     * @param  int  $outputQuality
     * @param  bool  $removeExif
     * @throws FileExistsException
     * @throws FileNotFoundException
     * @throws InvalidManipulation
     */
    public function process(
        Model $model,
        string $columnName,
        string $directory,
        string $outputExt = 'jpg',
        int $outputWidth = 788,
        int $outputHeight = 788,
        int $outputQuality = 100,
        bool $removeExif = true
    ): void {
        // Get Image URL from Model
        $imageUrl = $model->$columnName;

        //Generate Image Name
        $imageName = $this->getImageName();

        // Get image path from source
        $ext = substr($imageUrl, strrpos($imageUrl, '.'));

        // Build full path for downloaded image (on local)
        $localFullPath = self::TEMPORARY_FILE_PATH . $imageName . $ext;

        // Build cloud full path
        $cloudFullPath = $directory . '/' . $imageName . '.' . $outputExt;

        //Download file from URL and save image on local
        Storage::put($localFullPath, file_get_contents($imageUrl));

        $this->applyOptimizations($localFullPath, $outputWidth, $outputHeight, $outputQuality, $removeExif);

        $cloudUrl = $this->uploadFileToCloud($localFullPath, $cloudFullPath);
        $this->updateModel($model, $columnName, $cloudUrl);

        $this->removeOldImages($imageUrl, $localFullPath);
    }

    protected function getImageName(): string
    {
        return Str::uuid();
    }

    /**
     * @throws InvalidManipulation
     */
    protected function applyOptimizations(string $localFullPath, int $outputWidth, int $outputHeight, int $outputQuality, bool $removeExif): void
    {
        // Create optimizations array given parameters
        $optimizations = [];

        if ($removeExif) {
            $optimizations[] = '--strip-all';
        }

        if ($outputQuality > 0 && $outputQuality < 100) {
            $optimizations[] = '-m' . $outputQuality;
        }

        // Load image from storage using full path
        $img = Image::load(Storage::path($localFullPath));

        // If there are optimizations, include Jpegoptim process
        if (count($optimizations) > 0) {
            $img->optimize([Jpegoptim::class => $optimizations]);
        }

        // Set output width and height and save optimized image to desired location
        $img->width($outputWidth)->height($outputHeight);
        $img->save();
    }

    /**
     * @throws FileNotFoundException
     * @throws FileExistsException
     */
    protected function uploadFileToCloud(string $localFullPath, string $cloudFullPath): string
    {
        // Upload image to cloud
        Storage::disk('s3')->writeStream($cloudFullPath, Storage::readStream($localFullPath));

        // Get new cloud URL for image and return it
        return Storage::disk('s3')->url($cloudFullPath);
    }

    protected function updateModel(Model $model, string $columnName, string $cloudUrl): void
    {
        $model->$columnName = $cloudUrl;
        $model->save();
    }

    protected function removeOldImages(string $imageUrl, string $fullPath): void
    {
        // Remove cloud original image
        Storage::disk('s3')->delete(str_replace(config('filesystems.disks.s3.endpoint') . '/' . config('filesystems.disks.s3.bucket') . '/', '', $imageUrl));

        // Removed image from local disk
        Storage::delete($fullPath);
    }
}
