<?php

namespace App\Services;

use App\Models\HubspotDeal;
use App\Models\User;
use Exception;
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
        return new Client(['key' => config('services.hubspot.api_key')]);
    }

    /**
     * @throws \SevenShores\Hubspot\Exceptions\BadRequest
     */
    public function addUserAndAssignDeal(User $user): void
    {
        try {
            $hubspotClient = $this->getClient();

            $owner = new Owners($hubspotClient);
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
                    'value' => config('services.hubspot.pipline_stage_id_new_signup'),
                    'name' => 'dealstage',
                ],
                [
                    'value' => $ownerResponse[0]['ownerId'],
                    'name' => 'hubspot_owner_id',
                ],
            ];

            $deal = new Deals($hubspotClient);
            $response = $deal->create($createDeal);

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
                [
                    'property' => 'phone',
                    'value' => $user->phone ?: '',
                ],
            ];

            $contactResponse = $contact->create($createContact);

            $associateContact = new CrmAssociations($hubspotClient);
            $associateContact->create([
                // @phpstan-ignore-next-line
                'fromObjectId' => $contactResponse->vid,
                // @phpstan-ignore-next-line
                'toObjectId' => $response->dealId,
                'category' => 'HUBSPOT_DEFINED',
                'definitionId' => 4,
            ]);

            HubspotDeal::create([
                'deal_name' => $user->getFullName() ?: '',
                // @phpstan-ignore-next-line
                'deal_id' => $response->dealId,
                'user_email' => $user->email,
                'owner_id' => $ownerResponse[0]['ownerId'],
            ]);
        } catch (RequestException $exception) {
            report($exception);
            Log::error($exception);
        }
    }

    public function updateDealStageForOrderPlacedUser(User $user): void
    {
        $deal = HubspotDeal::where('user_email', $user->email)->first();
        if ($deal) {
            try {
                $updateProperties = [
                [
                    'value' => config('services.hubspot.pipline_stage_id_new_customer'),
                    'name' => 'dealstage',
                ],
            ];

                (new Deals($this->getClient()))->update(intval($deal->deal_id), $updateProperties);
            } catch (RequestException $exception) {
                report($exception);
                Log::error($exception);
            }
        } else {
            throw new Exception('Deal not found!');
        }
    }
}
