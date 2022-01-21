<?php

namespace Tests\Feature\Services;

use App\Models\MailchimpUser;
use App\Models\User;
use App\Services\Mailchimp\SendCustomersToMailchimpServices;
use Mockery;

use function Pest\Laravel\assertDatabaseCount;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->mockService = Mockery::mock(SendCustomersToMailchimpServices::class);
});

it('sends new user to mailchimp', function () {
    $expectedResponse = [
    "89998",
    "40a2e970cf0ab5b8e5083157a84a9d37",
      [
        "email_address" => "iwiegand@example.org",
        "status_if_new" => "unsubscribed",
        "skip_merge_validation" => true,
        "status" => "unsubscribed",
        "merge_fields" => [
          "FNAME" => "Carley",
          "LNAME" => "Reichel",
          "PHONE" => "",
        ],
      ],
    ];

    $template = "Test Name";
    $hash = md5(strtolower($this->user->email));
    $this->mockService->shouldReceive('setListMember')->with("89998", $hash, [
  "email_address" => $this->user->email,
  "status_if_new" => "unsubscribed",
  "skip_merge_validation" => true,
  "status" => "unsubscribed",
  "merge_fields" => [
      'FNAME' => $this->user->first_name ? $this->user->first_name : "",
      'LNAME' => $this->user->last_name ? $this->user->last_name : "",
      'PHONE' => $this->user->phone ? $this->user->phone : "",
  ],
])->andReturn($expectedResponse);

    if ($template === "Test Name") {
        $this->user->is_first_order = true;
        $this->user->save();
    }
});

it('create list on mailchimp', function () {
    $template = "Test Name";
    $expectedResponse = (object) [
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
  "marketing_permissions" => false,
  ];

    $this->mockService->shouldReceive('createList')->with([
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
  ])->andReturn($expectedResponse);

    MailchimpUser::create([
    'list_name' => $template,
    'list_id' => '89008',
  ]);

    assertDatabaseCount('mailchimp_users', 1);
});
