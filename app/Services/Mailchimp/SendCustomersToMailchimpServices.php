<?php

namespace App\Services\Mailchimp;

use App\Models\MailchimpUser;
use App\Models\User;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class SendCustomersToMailchimpServices {

    public const TEMPLATE_SIGN_UP_USERS = 'Robograding Signed Up Users';
    public const TEMPLATE_ORDER_PAID_CUSTOMERS = 'Robograding Orders Paid Customers';

    public function getConfiguration() {
        $mailchimpClient = new \MailchimpMarketing\ApiClient();
        $mailchimpClient->setConfig([
            'apiKey' => config('services.mailchimp.apiKey'),    
            'server' => config('services.mailchimp.server'),
        ]);
        return $mailchimpClient;
    }

    public function createListOnMailchimp($template){
        $mailchimpClient = $this->getConfiguration();
        try {
                $response = $mailchimpClient->lists->createList([
                "name" => $template,
                "permission_reminder" => "You created account on Robograding",
                "email_type_option" => true,
                "contact" => [
                    "company" => "AGS Inc.",
                    "address1" => "AGS Inc 727 Page Ave",
                    "city" => "Staten Island",
                    "country" => "USA",
                    "zip" => "10307",
                    "state" => "NY",
                ],
                "campaign_defaults" => [
                    "from_name" => "Robograding",
                    "from_email" => "no-reply@robograding.com",
                    "subject" => "Welcome To Robograding",
                    "language" => "EN",
                ],
            ]);
            MailchimpUser::create([
                    'list_name' => $template,
                    'list_id' => $response->id
                ]);
            $this->sendExistingUsersToMailchimp($template, $mailchimpClient);
        } catch(RequestException $ex){
            Log::debug($ex->getResponse()->getBody(true));
        }
    }

    public function getListId($template){
        return MailchimpUser::where('list_name', $template)->value('list_id'); 
    }

    public function sendExistingUsersToMailchimp($template, $mailchimpClient) {
        $list_id = $this->getListId($template);

        if($template === self::TEMPLATE_SIGN_UP_USERS){
            $users = $users = User::all();
        } else { 
            $users = User::with('orders')->whereHas('orders', function ($query) {
                $query->where('is_first_order', '=', false);
            })->get();
        }
        
        foreach ($users as $user) {
            $this->addDataToList($template, $user, $mailchimpClient, $list_id);
        }
    }

    public function addDataToList($template, $user, $mailchimpClient, $list_id){
        // dd($list_id);
        try {    
            $hash = md5(strtolower($user->email));
            $response = $mailchimpClient->lists->setListMember($list_id, $hash, [
            "email_address" => $user->email,
            "status_if_new" => "unsubscribed",
            "skip_merge_validation" => true,
            "status" => "unsubscribed",
            "merge_fields" => [
                // 'NAME' => $user->getFullName() ? $user->getFullName() : $user->first_name ." ". $user->last_name,
                'FNAME' => $user->first_name ? $user->first_name : "",
                'LNAME' => $user->last_name ? $user->last_name : "",
                'PHONE' => $user->phone ? $user->phone : "",
            ],
        ]);
            if($template === self::TEMPLATE_ORDER_PAID_CUSTOMERS){
                $user->is_first_order = true;
                $user->save();
            }

            Log::info(json_encode($response->id));
        } catch (RequestException $ex) {
            Log::debug($ex->getResponse()->getBody(true));
        }
    }

    public function sendNewUsers($user, $template){
        $mailchimpClient = $this->getConfiguration();
        $list_id = $this->getListId($template);
        if ($list_id){
            $this->addDataToList($template, $user, $mailchimpClient, $list_id);
        }
    }
}