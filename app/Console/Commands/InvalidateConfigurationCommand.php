<?php

namespace App\Console\Commands;

use App\Services\ConfigurationService\ConfigurationService;
use Illuminate\Console\Command;

class InvalidateConfigurationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'configuration:invalidate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Invalidate cached configurations';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(ConfigurationService $configurationService)
    {
        $this->info("Invalidate configurations...");
        $configurationService->invalidateConfigurations();
        $this->info("Done.");
        return 0;
    }
}
