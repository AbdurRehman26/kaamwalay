<?php

namespace App\Console\Commands\Hubspot;

use App\Models\HubspotDeal;
use App\Models\User;
use App\Services\HubspotService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use SevenShores\Hubspot\Exceptions\BadRequest;
use SevenShores\Hubspot\Http\Client;
use SevenShores\Hubspot\Resources\Contacts;
use SevenShores\Hubspot\Resources\CrmAssociations;
use SevenShores\Hubspot\Resources\Deals;
use stdClass;

class AssociateContactToCorruptedDeals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hubspot:associate-contact-to-deals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'It creates and associates contacts on the deals which are missing contacts.';

    /**
     * Execute the console command.
     */
    public function handle(HubspotService $hubspotService): int
    {
        $offset = 0;
        $hasMore = true;
        $hubspotClient = $hubspotService->getClient();
        $since = $this->ask('Enter epoch timestamp (since)');

        while ($hasMore == true) {
            $fetchedDealsResponse = (new Deals($hubspotClient))->getRecentlyCreated([
                'since' => $since,
                'offset' => $offset,
                'limit' => 100,
            ]);

            $this->info("Processing offset: $offset");

            // @phpstan-ignore-next-line
            $deals = collect($fetchedDealsResponse->getData()->results)
                ->filter(function ($deal) {
                    return ! empty($deal->properties->pipeline->value)
                        && $deal->properties->pipeline->value === config('services.hubspot.pipeline_id')
                        && ! empty($deal->properties->dealstage->value)
                        && $deal->properties->dealstage->value === config('services.hubspot.pipline_stage_id_new_signup')
                        && $deal->properties->num_associated_contacts->value === '0'; // @phpstan-ignore-line
                });

            $this->info('Number of matched deals: '.$deals->count());
            $this->info('Processing matched deals ...');

            $deals->each(function ($deal) use ($hubspotClient, $since) {
                $this->info('Processing deal: ' . $deal->properties->dealname->value);

                $sinceDateTimeString = Carbon::createFromTimestamp($since)->toDateTimeString();
                $dealNameArray = explode(' ', $deal->properties->dealname->value);

                if (count($dealNameArray) === 3) {
                    $user = User::where('first_name', $dealNameArray[0])
                        ->where('last_name', $dealNameArray[1] . ' ' . $dealNameArray[2])
                        ->where('created_at', '>=', $sinceDateTimeString)
                        ->first();
                } elseif (count($dealNameArray) === 2) {
                    $user = User::where('first_name', $dealNameArray[0])->where('last_name', $dealNameArray[1])
                        ->where('created_at', '>=', $sinceDateTimeString)
                        ->first();
                } else {
                    $user = User::where('first_name', $dealNameArray[0])
                        ->where('created_at', '>=', $sinceDateTimeString)
                        ->first();
                }

                if ($user) {
                    $this->createAndAssociateContact($hubspotClient, $deal, $user);
                    $this->createDealLocally($deal, $user);

                    $this->info('Deal processed');
                }
            });

            // @phpstan-ignore-next-line
            $offset = $fetchedDealsResponse->offset;
            // @phpstan-ignore-next-line
            $hasMore = $fetchedDealsResponse->hasMore;

            $this->newLine();
        }

        $this->info('Processing complete');

        return Command::SUCCESS;
    }

    protected function createAndAssociateContact(Client $hubspotClient, stdClass $deal, User $user): void
    {
        try {
            $contactResponse = (new Contacts($hubspotClient))->create([
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
            ]);

            // @phpstan-ignore-next-line
            $vid = $contactResponse->vid;
        } catch (BadRequest $e) {
            $vid = (json_decode($e->getResponse()->getBody()))->identityProfile->vid;
        }

        $associateContact = new CrmAssociations($hubspotClient);
        $associateContact->create([
            'fromObjectId' => $vid,
            'toObjectId' => $deal->dealId,
            'category' => 'HUBSPOT_DEFINED',
            'definitionId' => 4,
        ]);
    }

    protected function createDealLocally(stdClass $deal, User $user): void
    {
        HubspotDeal::updateOrCreate(
            [
                'deal_id' => $deal->dealId,
            ],
            [
                'deal_name' => $deal->properties->dealname->value,
                'deal_id' => $deal->dealId,
                'user_email' => $user->email,
                'owner_id' => $deal->properties->hubspot_owner_id->value,
            ]
        );
    }
}
