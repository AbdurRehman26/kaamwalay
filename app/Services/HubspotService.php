<?php 

namespace App\Services;

use App\Http\APIClients\HubspotClient;
use App\Models\User;
class HubspotService {
    
    public function addUserAndAssignDeal(User $user) {
        $hubspotclient = new HubspotClient();        
        $hubspotclient->addUserAndAssignDeal($user);
    }

}