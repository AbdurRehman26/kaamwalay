<?php 

namespace App\Services;

use App\Models\User;
use HubSpot\Factory;

class HubspotService {
    public function getClient() {
        $hubSpot = Factory::createWithApiKey(config('services.hubspot.apiKey'));
        return $hubSpot;
    }

    public function addUserToHubspotContacts(User $user) {
        $hubSpot = $this->getClient();
        dd($hubSpot);
        $contactInput = new \HubSpot\Client\Crm\Contacts\Model\SimplePublicObjectInput();
        $contactInput->setProperties([
                'email' => $user->email,
                'firstname' => $user->first_name ?: '',
                'lastname' => $user->last_name ?: '',
                'phone' => $user->phone ?: '',
        ]);

        $contact = $hubSpot->crm()->contacts()->basicApi()->create($contactInput);
        dd($contact);
    }

}