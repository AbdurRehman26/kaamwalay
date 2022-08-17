<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Wnx\SidecarBrowsershot\BrowsershotLambda;

class SocialPreviewLambdaService
{
    public function generateFromView(string $view, array $data, string $imageType, int $quality, int $width, int $height, string $cloudPath): string
    {
        BrowsershotLambda::html(view($view, $data)->render())
            ->windowSize($width, $height)
            ->setScreenshotType($imageType, $quality)
            ->saveToS3($cloudPath);

        return Storage::disk('s3')->url($cloudPath);
    }
}
