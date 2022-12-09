<?php

namespace App\Services;

use App\Models\HubspotDeal;
use App\Models\Order;
use App\Models\User;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use SevenShores\Hubspot\Exceptions\BadRequest;
use SevenShores\Hubspot\Http\Client;
use SevenShores\Hubspot\Resources\Contacts;
use SevenShores\Hubspot\Resources\CrmAssociations;
use SevenShores\Hubspot\Resources\Deals;
use SevenShores\Hubspot\Resources\Owners;

class HubspotService
{
    public function getClient(): Client
    {
        return new Client(['key' => config('services.hubspot.api_key'), 'oauth2' => true]);
    }

    /**
     * @throws \SevenShores\Hubspot\Exceptions\BadRequest
     */
    public function addUserAndAssignDeal(User $user): void
    {
        try {
            $hubspotClient = $this->getClient();

            $owner = new Owners($hubspotClient);

            $owners = explode(',', config('services.hubspot.owner_email'));

            if (count($owners) > 1) {
                if (! Cache::has('hubspot:iteration')) {
                    Cache::put('hubspot:iteration', 0);
                }

                Cache::put('hubspot:owner', $owners[Cache::get('hubspot:iteration')]);

                if (Cache::get('hubspot:iteration') < count($owners) - 1) {
                    Cache::increment('hubspot:iteration');
                } else {
                    Cache::put('hubspot:iteration', 0);
                }
            } else {
                Cache::put('hubspot:owner', $owners);
            }

            $ownerResponse = $owner->all(['email' => Cache::get('hubspot:owner')]);

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
        } catch (BadRequest $exception) {
            Log::error($exception->getMessage());
        }
    }

    public function updateDealStageForPaidOrder(Order $order): void
    {
        $propertiesToUpdate = [
            [
                'value' => config('services.hubspot.pipline_stage_id_closed'),
                'name' => 'dealstage',
            ],
        ];

        $this->updateDealStage($order, $propertiesToUpdate);
    }

    public function updateDealStageForOrderPlacedUser(Order $order): void
    {
        $propertiesToUpdate = [
            [
                'value' => config('services.hubspot.pipline_stage_id_new_customer'),
                'name' => 'dealstage',
            ],
            [
                'value' => $order->grand_total,
                'name' => 'amount',
            ],
        ];
        $this->updateDealStage($order, $propertiesToUpdate);
    }

    protected function updateDealStage(Order $order, array $propertiesToUpdate): void
    {
        $deal = HubspotDeal::where('user_email', $order->user->email)->first();
        
        if (! $deal) {
            Log::error('Hubspot deal not found', [
                'user_email' => $order->user->email,
            ]);

            return;
        }

        try {
            (new Deals($this->getClient()))->update(intval($deal->deal_id), $propertiesToUpdate);
        } catch (RequestException $exception) {
            report($exception);
            Log::error($exception->getMessage());
        }
    }
}
