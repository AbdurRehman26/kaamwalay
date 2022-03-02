<?php

namespace App\Services;

use App\Models\User;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use SevenShores\Hubspot\Http\Client;
use SevenShores\Hubspot\Resources\Contacts;
use SevenShores\Hubspot\Resources\CrmAssociations;
use SevenShores\Hubspot\Resources\Deals;
use SevenShores\Hubspot\Resources\Owners;

class HubspotService
{
    public function getClient(): Client
    {
        // @phpstan-ignore-next-line
        $hubspotClient = new Client(['key' => config('services.hubspot.apiKey')]);

        return $hubspotClient;
    }

    public function addUserAndAssignDeal(User $user): void
    {
        try {
            $hubspotClient = $this->getClient();
            // @phpstan-ignore-next-line
            $owner = new Owners($hubspotClient);
            
            // @phpstan-ignore-next-line
            $ownerResponse = $owner->all(['email' => config('services.hubspot.owner_email')]);
  
            $createDeal = [
                  [
                    'value' => $user->getFullName() ?: '',
                    'name' => 'dealname',
                  ],
                  [
                    'value' => config('services.hubspot.pipeline_id'),
                    'name' => 'pipeline',
                  ],
                  [
                    'value' => config('services.hubspot.pipline_stage_id'),
                    'name' => 'dealstage',
                  ],
                  [
                    'value' => $ownerResponse[0]['ownerId'],
                    'name' => 'hubspot_owner_id',
                  ],
                ];
            // @phpstan-ignore-next-line
            $deal = new Deals($hubspotClient);
            // @phpstan-ignore-next-line
            $response = $deal->create($createDeal);
            // @phpstan-ignore-next-line
            $contact = new Contacts($hubspotClient);
            $createContact = [
                [
                    'property' => 'email',
                    'value' => $user->email ?: '',
                ],
                [
                    'property' => 'firstname',
                    'value' => $user->first_name ?: '',
                ],
                [
                    'property' => 'lastname',
                    'value' => $user->last_name ?: '',
                ],
            ];
            // @phpstan-ignore-next-line
            $contactResponse = $contact->create($createContact);
            // @phpstan-ignore-next-line
            $associateContact = new CrmAssociations($hubspotClient);
            // @phpstan-ignore-next-line
            $associateContact->create([
            // @phpstan-ignore-next-line
            "fromObjectId" => $contactResponse->vid,
            // @phpstan-ignore-next-line
            "toObjectId" => $response->dealId,
            "category" => "HUBSPOT_DEFINED",
            "definitionId" => 4,
          ]);
        } catch (RequestException $exception) {
            Log::error($exception);
        }
    }
}
