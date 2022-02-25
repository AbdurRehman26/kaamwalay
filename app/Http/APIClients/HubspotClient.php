<?php

namespace App\Http\APIClients;

use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HubspotClient {

    protected function getBaseUrl(): string
    {
        return config('services.hubspot.base_url');
    }

    protected function getConfiguration(): string
    {
        return config('services.hubspot.apiKey');
    }

    public function addUserAndAssignDeal($user) {
        $data = array(
            'properties' => array(
                array(
                    'property' => 'email',
                    'value' => $user->email ?: '' 
                ),
                array(
                    'property' => 'firstname',
                    'value' => $user->first_name ?: ''
                ),
                array(
                    'property' => 'lastname',
                    'value' => $user->last_name ?: ''
                ),
                array(
                    'property' => 'phone',
                    'value' => $user->phone ?: ''
                )
            )
        );

        $post_json = json_encode($data);
        $endpoint =  $this->getBaseUrl() . '/contacts/v1/contact?hapikey=' . $this->getConfiguration();
        $ch = @curl_init();

        @curl_setopt($ch, CURLOPT_POST, true);
        @curl_setopt($ch, CURLOPT_POSTFIELDS, $post_json);
        @curl_setopt($ch, CURLOPT_URL, $endpoint);

        @curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        @curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = @curl_exec($ch);
        
        $status_code = @curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_errors = curl_error($ch);
        @curl_close($ch);
        
        $response = json_decode($response);

        if($status_code === 200) {
            try {
                $response = Http::put( $this->getBaseUrl() . '/deals/v1/deal/' . config('services.hubspot.deal_id') . '/associations/CONTACT?id=' . $response->vid . '&hapikey=' . $this->getConfiguration());
            } catch (RequestException $exception) {
                Log::error($exception);
            }
        } else {
            Log::error($curl_errors);
        }

    }

}