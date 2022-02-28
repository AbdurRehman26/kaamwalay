<?php

namespace App\Http\APIClients;

use App\Models\HubspotDeal;
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

    public function createDeal(): void {
         // create deal 
        $dealData = array (
            'properties' => array(
                array (
                  'value' => 'AGS',
                  'name' => 'dealname',
                ),
                array (
                  'value' => 'AGS',
                  'name' => 'pipeline',
                ),
                // array (
                //   'value' => 'AGS',
                //   'name' => 'dealstage',
                // ),
                // array (
                //   'value' => '', // add here owner id
                //   'name' => 'hubspot_owner_id',
                // ),
            ) 
        );
        
        $endpoint =  $this->getBaseUrl() . '/deals/v1/deal?hapikey=' . $this->getConfiguration();
        
        $response = $this->makeApiCall($dealData, $endpoint);
        
        HubspotDeal::create([
            'deal_id' => $response->dealId,
            'deal_name' => $response->properties->dealname->value
        ]);
    }

    public function makeApiCall($data, $url) {
        try {

        $post_json = json_encode($data);
        $ch = @curl_init();

        @curl_setopt($ch, CURLOPT_POST, true);
        @curl_setopt($ch, CURLOPT_POSTFIELDS, $post_json);
        @curl_setopt($ch, CURLOPT_URL, $url);

        @curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        @curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = @curl_exec($ch);
        // echo "\nResponse: " . $response;
        gettype(json_decode($response));
        return json_decode($response);
        } catch (RequestException $exception) {
            Log::error($exception);
        }
        // $status_code = @curl_getinfo($ch, CURLINFO_HTTP_CODE);
        // $curl_errors = curl_error($ch);
        // @curl_close($ch);
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

        $endpoint =  $this->getBaseUrl() . '/contacts/v1/contact?hapikey=' . $this->getConfiguration();

        $response = $this->makeApiCall($data, $endpoint);
        
        // if($status_code === 200) {
            try {
                $dealId = HubspotDeal::where('deal_name', 'AGS')->first()->list_id;
                $response = Http::put( $this->getBaseUrl() . '/deals/v1/deal/' . $dealId . '/associations/CONTACT?id=' . $response->vid . '&hapikey=' . $this->getConfiguration());
            } catch (RequestException $exception) {
                Log::error($exception);
            }
        // } else {
        //     Log::error($curl_errors);
        // }

    }

}