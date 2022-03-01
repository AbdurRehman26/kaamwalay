<?php 

namespace App\Services;

use App\Http\APIClients\HubspotClient;
use App\Models\User;
class HubspotService {
    
    public function __construct(protected HubspotClient $hubspotclient)
    {
    }

    public function createDeal(): void {
        $this->hubspotclient->createDeal();
    }

    public function addUserAndAssignDeal(User $user): void { 
        $this->hubspotclient->addUserAndAssignDeal($user);
    }

}