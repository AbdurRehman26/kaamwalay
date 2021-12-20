<?php

namespace App\Jobs\Images;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Image\Image;
use Spatie\ImageOptimizer\Optimizers\Jpegoptim;

class ImageOptimizer implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        protected Model $model,
        protected string $columnName,
        protected string $s3Folder,
        protected string $outputExt = 'jpg',
        protected int $outputWidth = 788,
        protected int $outputHeight = 788,
        protected int $outputQuality = 100,
        protected bool $removeExif = true
    ) {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Get Model Instance and image Url
        $model = $this->model;
        $columnName = $this->columnName;
        $imageUrl = $model->$columnName;

        // Get Image name
        $imageName = Str::uuid();

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
        $outputFullPath = $outputPath . $imageName . '.' . $this->outputExt;
        // Build S3 Full Path
        $s3FullPath = $this->s3Folder . '/' . $imageName . '.' . $this->outputExt;

        //Save image in disk
        Storage::put($fullPath, $contents);

        // Create optimizations array given parameters
        $optimizations = [];
        if ($this->removeExif) {
            array_push($optimizations, '--strip-all');
        }

        if ($this->outputQuality < 100 && $this->outputQuality > 0) {
            array_push($optimizations, '-m' . $this->outputQuality);
        }

        // Load image from storage using full path
        $img = Image::load(Storage::path($fullPath));

        // If there are optimizations, include Jpegoptim process
        if (count($optimizations) > 0) {
            $img->optimize([Jpegoptim::class => $optimizations]);
        }
        // Set output width and height and save optimized image to desired location
        $img->width($this->outputWidth)->height($this->outputHeight)
            ->save($outputFullPath);

        // Upload image to S3
        Storage::disk('s3')->writeStream($s3FullPath, Storage::readStream($path . 'optimized/' . $imageName . '.' . $this->outputExt));

        // Get new S3 URL for image
        $s3Url = Storage::disk('s3')->url($s3FullPath);

        // Update model image property
        $model->$columnName = $s3Url;
        $model->save();

        // Remove S3 original image
        Storage::disk('s3')->delete(str_replace(config('filesystems.disks.s3.endpoint') . '/' . config('filesystems.disks.s3.bucket') . '/', '', $imageUrl));

        // Removed downloaded and optimized image from local disk
        Storage::delete($fullPath);
        Storage::delete($path . 'optimized/' . $imageName . '.' . $this->outputExt);
    }
}
