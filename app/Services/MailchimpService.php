<?php

namespace App\Services;

use App\Models\MailchimpList;
use App\Models\OrderStatus;
use App\Models\User;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use MailchimpMarketing\ApiClient;

class MailchimpService
{
    public const LIST_NAME_SIGN_UP_USERS = 'Signed Up Users';
    public const LIST_NAME_ORDER_PAID_CUSTOMERS = 'Order Paid Customers';

    public function getClient(): ApiClient
    {
        $mailchimpClient = new ApiClient();
        $mailchimpClient->setConfig([
            'apiKey' => config('services.mailchimp.apiKey'),
            'server' => config('services.mailchimp.server'),
        ]);

        return $mailchimpClient;
    }

    public function createListsOnMailchimp(array $newList): void
    {
        $mailchimpClient = $this->getClient();

        $lists = [];
        // @phpstan-ignore-next-line
        $existingLists = $mailchimpClient->lists->getAllLists()->lists;

        foreach ($existingLists as $existingList) {
            $lists[] = $existingList->name;
        }

        try {
            foreach ($newList as $listName) {
                $name = $this->buildListName($listName);
                if (! in_array($name, $lists)) {
                    // @phpstan-ignore-next-line
                    $response = $mailchimpClient->lists->createList([
                        'name' => $name,
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

                    MailchimpList::create([
                        'list_name' => $name,
                        'list_id' => $response->id,
                    ]);
                }
            }
        } catch (RequestException $ex) {
            Log::error($ex->getResponse()->getBody());
        }
    }

    public function getListId(string $template): ?string
    {
        return MailchimpList::where('list_name', $template)->first()->list_id;
    }

    public function sendExistingUsersToMailchimp(string $template): void
    {
        $templateName = $this->buildListName($template);

        User::chunkById(500, function ($users) use ($templateName) {
            $members = $users->map(function (User $user) {
                return $this->prepareUserDataForList($user);
            })->toArray();

            $this->addBatchUsers($members, $this->getListId($templateName));
        });
    }

    public function sendExistingOrderPaidCustomersToMailchimp(string $template): void
    {
        $templateName = $this->buildListName($template);

        User::with('orders')->whereHas('orders', function ($query) {
            $query->where('order_status_id', '>=', OrderStatus::PLACED);
        })->chunkById(500, function ($users) use ($templateName) {
            $members = $users->map(function (User $user) {
                return $this->prepareUserDataForList($user);
            })->toArray();

            $this->addBatchUsers($members, $this->getListId($templateName));
        });
    }

    public function addUserToList(User $user, string $template): void
    {
        $templateName = $this->buildListName($template);
        $listId = $this->getListId($templateName);
        if ($listId) {
            $this->addDataToList($user, $listId);
        }
    }

    public function deleteUserFromList(User $user, string $template): void
    {
        $templateName = $this->buildListName($template);
        $listId = $this->getListId($templateName);
        if ($listId) {
            $this->removeDataFromList($user, $listId);
        }
    }

    protected function addBatchUsers(array $members, string $listId): void
    {
        try {
            $mailchimpClient = $this->getClient();
            // @phpstan-ignore-next-line
            $mailchimpClient->lists->batchListMembers($listId, ['members' => $members]);
        } catch (RequestException $ex) {
            Log::error($ex->getResponse()->getBody());
        }
    }

    protected function addDataToList(User $user, string $listId): void
    {
        $mailchimpClient = $this->getClient();

        try {
            $hash = md5(strtolower($user->email));
            // @phpstan-ignore-next-line
            $mailchimpClient->lists->setListMember($listId, $hash, $this->prepareUserDataForList($user));
        } catch (RequestException $ex) {
            Log::error($ex->getResponse()->getBody());
        }
    }

    public function cleanDuplicateUsersBetweenLists(string $usersListToKeep, string $usersListToClean): void
    {
        $keepTemplateName = $this->buildListName($usersListToKeep);
        $cleanTemplateName = $this->buildListName($usersListToClean);

        $keepListId = $this->getListId($keepTemplateName);
        $cleanListId = $this->getListId($cleanTemplateName);

        if ($keepListId && $cleanListId) {
            $this->cleanDuplicateUsersBetweenListIds($keepListId, $cleanListId);
        }
    }

    protected function removeDataFromList(User $user, string $listId): void
    {
        $mailchimpClient = $this->getClient();

        try {
            $hash = md5(strtolower($user->email));
            // @phpstan-ignore-next-line
            $mailchimpClient->lists->deleteListMember($listId, $hash);
        } catch (RequestException $ex) {
            Log::error($ex->getResponse()->getBody());
        }
    }

    protected function removeDataFromListByHash(string $hash, string $listId): void
    {
        $mailchimpClient = $this->getClient();

        try {
            // @phpstan-ignore-next-line
            $mailchimpClient->lists->deleteListMember($listId, $hash);
        } catch (RequestException $ex) {
            Log::error($ex->getResponse()->getBody());
        }
    }

    protected function buildListName(string $listName): string
    {
        return 'Robograding ' . ucfirst(app()->environment()) . ' - ' . $listName;
    }

    protected function prepareUserDataForList(User $user): array
    {
        return [
            'email_address' => $user->email,
            'status_if_new' => 'subscribed',
            'skip_merge_validation' => true,
            'status' => 'subscribed',
            'merge_fields' => [
                'FNAME' => $user->first_name ?: '',
                'LNAME' => $user->last_name ?: '',
                'PHONE' => $user->phone ?: '',
            ],
        ];
    }

    protected function cleanDuplicateUsersBetweenListIds(string $keepListId, string $cleanListId): void
    {
        $keepListMembersInfo = $this->getFullListMembers($keepListId);
        $cleanListMembersInfo = $this->getFullListMembers($cleanListId);

        foreach ($keepListMembersInfo as $keepMember) {
            $result = array_values($this->filterMembersListById($cleanListMembersInfo, $keepMember->id));

            if (count($result) > 0) {
                \Log::debug("Match found: $keepMember->id");
                $this->removeDataFromListByHash($keepMember->id, $cleanListId);
            }
        }
    }

    protected function getFullListMembers(string $listId): array
    {
        $mailchimpClient = $this->getClient();
        $fields = 'members.id,members.email_address,total_items';

        $members = [];
        $totalItems = 999;
        $i = 0;

        while (count($members) < $totalItems) {
            try {
                // @phpstan-ignore-next-line
                $result = $mailchimpClient->lists->getListMembersInfo($listId, $fields, null, 1000, 1000 * $i);

                $totalItems = $result->total_items;
                $members = array_merge($members, $result->members);

                $i += 1;
            } catch (RequestException $ex) {
                Log::error($ex->getResponse()->getBody());

                break;
            }
        }

        return $members;
    }

    protected function filterMembersListById(array $membersList, string $searchId): array
    {
        return array_filter($membersList, function ($member) use ($searchId) {
            return $member->id === $searchId;
        });
    }
}
