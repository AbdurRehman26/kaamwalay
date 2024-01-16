<?php

namespace App\Console\Commands;

use App\Services\AutographProductService;
use Exception;
use Illuminate\Console\Command;

class ImportAutographProductsCommand extends Command
{
    protected $signature = 'autograph-products:import';

    protected $description = 'Import autograph products and images from files.';

    /**
     * @throws Exception
     */
    public function handle(AutographProductService $autographProductService): void
    {
        $productsFilename = $this->ask('Products Filename (storage/app/)');
        $imagesDirectory = $this->ask('Images Directory (storage/app/)');

        $autographProductService->import($productsFilename, $imagesDirectory);
    }
}
