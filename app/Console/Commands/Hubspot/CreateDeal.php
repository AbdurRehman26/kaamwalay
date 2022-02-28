<?php

namespace App\Console\Commands\Hubspot;

use App\Services\HubspotService;
use Illuminate\Console\Command;

class CreateDeal extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hubspot:create-deal';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create Deal on hubspot';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(HubspotService $hubspotService)
    {
        $hubspotService->createDeal();
        
        return 0;
    }
}
