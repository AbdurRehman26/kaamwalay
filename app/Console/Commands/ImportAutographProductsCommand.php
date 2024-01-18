<?php

namespace App\Console\Commands;

use App\Services\AutographProductService;
use Exception;
use Illuminate\Console\Command;
use function Laravel\Prompts\select;
use function Laravel\Prompts\text;

class ImportAutographProductsCommand extends Command
{
    protected $signature = 'autograph-products:import';

    protected $description = 'Import autograph products and images from files.';

    /**
     * @throws Exception
     */
    public function handle(AutographProductService $autographProductService): void
    {
        $importType = select('What do you want to import?', [
            1 => 'Products',
            2 => 'Images'
        ]);

        if ($importType === 1) {
            $productsFilename = text(
                label: 'What is file name?',
                placeholder: 'E.g. products.csv',
                required: true,
                hint: 'File must be exist in (storage/app/)',
            );

            $autographProductService->importProducts($productsFilename);
        } elseif ($importType === 2) {
            $imagesDirectory = text(
                label: 'What is directory name?',
                placeholder: 'E.g. images',
                required: true,
                hint: 'Directory must exist in (storage/app/)',
            );

            $filePrefix = text(
                label: 'What is files prefix?',
                placeholder: 'E.g. IMG-',
                default: 'IMG-',
                required: true,
                hint: 'Prefix string in file names before certificate number'
            );

            $autographProductService->importImages($imagesDirectory, $filePrefix);
        }
    }
}
