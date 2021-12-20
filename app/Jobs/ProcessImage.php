<?php

namespace App\Jobs;

use App\Services\ProcessImageService;
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

class ProcessImage implements ShouldQueue
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
    )
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        (new ProcessImageService)->process($this->model, $this->columnName, $this->s3Folder, $this->outputExt, $this->outputWidth, $this->outputHeight, $this->outputQuality, $this->removeExif);
    }
}
