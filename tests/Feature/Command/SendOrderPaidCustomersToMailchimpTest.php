
<?php

use App\Services\Mailchimp\SendCustomersToMailchimpServices;
use Mockery as Mock;


beforeEach(function (){
    $this->mockService = Mock::mock(SendCustomersToMailchimpServices::class);
});

it('sync users to mailchimp', function () {

    $template = "Test Name";
    $this->expectedResponse = (object) [
    "id" => "ec3e963ab2",
    "web_id" => "324778",
    "name" => $template,
    "contact" => (object) [
        "company" => "AGS Inc.",
        "address1" => "AGS Inc 727 Page Ave",
        "address2" => "",
        "city" => "Staten Island",
        "state" => "NY",
        "zip" => "10307",
        "country" => "US",
        "phone" => "",
    ],
    "permission_reminder" => "Welcome",
    "use_archive_bar" => true,
    "campaign_defaults" => (object) [
        "from_name" => "XYZ Marketing",
        "from_email" => "no-reply@test.com",
        "subject" => "Welcome To XYZ",
        "language" => "EN",
    ],
    "notify_on_subscribe" => "",
    "notify_on_unsubscribe" => "",
    "date_created" => "2022-01-20T13:11:06+00:00",
    "list_rating" => "0",
    "email_type_option" => true,
    "subscribe_url_short" => "http://eepurl.com/hSGSyP",
    "subscribe_url_long" => "https://wooter.us11.list-manage.com/subscribe?u=d85a50fb1eb123982677f3af8&id=ec3e963ab2",
    "beamer_address" => "us112b577814e892a8dcdcdb@inbound.mailchimp.com",
    "visibility" => "prv",
    "double_optin" => false,
    "has_welcome" => false,
    "marketing_permissions" => false
    ];

    $res = $this->mockService->shouldReceive('createList')->with([
        "name" => $template,
        "permission_reminder" => "Welcome",
        "email_type_option" => true,
        "contact" => [
            "company" => "Test Inc.",
            "address1" => "Test xyz street 234",
            "city" => "Test ",
            "country" => "USA",
            "zip" => "09874",
            "state" => "NY",
        ],
        "campaign_defaults" => [
            "from_name" => "XYZ Marketing",
            "from_email" => "no-reply@test.com",
            "subject" => "Welcome To XYZ",
            "language" => "EN",
        ],
      ])->andReturn($this->expectedResponse);
    //   dd($res);


    $this->artisan('sync:order-paid-customers');
    // $artisan = app(TestsArtisan::class);
    // Artisan::swap($artisan);

});
