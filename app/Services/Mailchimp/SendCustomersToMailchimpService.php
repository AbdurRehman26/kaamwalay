<?php

namespace App\Services\Mailchimp;

use App\Models\MailchimpUser;
use App\Models\User;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class SendCustomersToMailchimpService
{
    public const LIST_NAME_SIGN_UP_USERS = 'Robograding Signed Up Users';
    public const LIST_NAME_ORDER_PAID_CUSTOMERS = 'Robograding Orders Paid Customers';

    public function getConfiguration(): \MailchimpMarketing\ApiClient
    {
        $mailchimpClient = new \MailchimpMarketing\ApiClient();
        $mailchimpClient->setConfig([
            'apiKey' => config('services.mailchimp.apiKey'),
            'server' => config('services.mailchimp.server'),
        ]);

        return $mailchimpClient;
    }

    public function createListOnMailchimp(array $newList): void
    {
        if (app()->environment('local')) {
            return;
        }

        $mailchimpClient = $this->getConfiguration();

        $lists = [];
        // @phpstan-ignore-next-line
        $createdLists = $mailchimpClient->lists->getAllLists();

        foreach ($createdLists->lists as $createdList) {
            $lists[] = $createdList->name;
        }

        try {
            foreach ($newList as $listName) {
                if (! in_array($listName, $lists)) {
                    // @phpstan-ignore-next-line
                    $response = $mailchimpClient->lists->createList([
                            'name' => $listName,
                            'permission_reminder' => 'You created account on Robograding',
                            'email_type_option' => true,
                            'contact' => [
                                'company' => 'AGS Inc.',
                                'address1' => 'AGS Inc 727 Page Ave',
                                'city' => 'Staten Island',
                                'country' => 'USA',
                                'zip' => '10307',
                                'state' => 'NY',
                            ],
                            'campaign_defaults' => [
                                'from_name' => 'Robograding',
                                'from_email' => 'no-reply@robograding.com',
                                'subject' => 'Welcome To Robograding',
                                'language' => 'EN',
                            ],
                        ]);
                    MailchimpUser::create([
                            'list_name' => $listName,
                            'list_id' => $response->id,
                        ]);
                    Log::info(json_encode($response->id));
                }
            }
        } catch (RequestException $ex) {
            Log::error($ex->getResponse()->getBody());
        }
    }

    public function getListId(string $template): string|null
    {
        return MailchimpUser::where('list_name', $template)->value('list_id');
    }

    public function sendExistingUsersToMailchimp(string $template): void
    {
        $list_id = $this->getListId($template);
        
        $users = User::all();

        if ($template === self::LIST_NAME_ORDER_PAID_CUSTOMERS) {
            $users = User::with('orders')->has('orders')->get();
        }

        foreach ($users as $user) {
            $this->addDataToList($user, $list_id);
        }
    }

    public function addDataToList(User $user, string $list_id): void
    {
        if (app()->environment('local')) {
            return;
        }
        
        $mailchimpClient = $this->getConfiguration();

        try {
            $hash = md5(strtolower($user->email));
            // @phpstan-ignore-next-line
            $response = $mailchimpClient->lists->setListMember($list_id, $hash, [
            'email_address' => $user->email,
            'status_if_new' => 'unsubscribed',
            'skip_merge_validation' => true,
            'status' => 'unsubscribed',
            'merge_fields' => [
                'FNAME' => $user->first_name ? $user->first_name : '',
                'LNAME' => $user->last_name ? $user->last_name : '',
                'PHONE' => $user->phone ? $user->phone : '',
            ],
        ]);

            Log::info(json_encode($response->id));
        } catch (RequestException $ex) {
            Log::error($ex->getResponse()->getBody());
        }
    }

    public function sendNewUsers(User $user, string $template): void
    {
        $list_id = $this->getListId($template);
        if ($list_id) {
            $this->addDataToList($user, $list_id);
        }
    }
}
