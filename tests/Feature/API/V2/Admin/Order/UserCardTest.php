<?php

use App\Jobs\Admin\Order\UpdateHumanGradesInAgs;
use App\Models\User;
use App\Models\UserCardCertificate;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->userCardCertificate = UserCardCertificate::factory()->create();
    $this->userCard = $this->userCardCertificate->userCard;
    $this->order = $this->userCard->orderItem->order;
    $this->seed(RolesSeeder::class);
    $this->actingAs(User::factory()->withRole(config('permission.roles.admin'))->create());
});

uses()->group('admin', 'grading');

it('stores the human grades with calculations of overall and does not update data on AGS', function () {
    Http::fake();
    $this->putJson('/api/v2/admin/orders/' . $this->order->id . '/cards/' . $this->userCard->id . '/grades', [
        'human_grade_values' => [
            'front' => [
                'center' => 2.50,
                'surface' => 0,
                'edge' => 0,
                'corner' => 0,
            ],
            'back' => [
                'center' => 4.80,
                'surface' => 0,
                'edge' => 0,
                'corner' => 0,
            ],
        ],
    ])
    ->assertOk()
    ->assertJsonFragment(['center' => 3.4]);

    Http::assertNothingSent();
});

it('stores the human grades and dispatches update call to AGS', function () {
    Bus::fake();

    $this->putJson('/api/v2/admin/orders/' . $this->order->id . '/cards/' . $this->userCard->id . '/grades', [
        'human_grade_values' => [
            'front' => [
                'center' => 2.50,
                'surface' => 2.50,
                'edge' => 2.50,
                'corner' => 2.50,
            ],
            'back' => [
                'center' => 2.50,
                'surface' => 2.50,
                'edge' => 2.50,
                'corner' => 2.50,
            ],
        ],
    ])
    ->assertOk()
    ->assertJsonCount(4, 'data.overall_values')
    ->assertJsonCount(2, 'data.grade');

    Bus::assertDispatched(UpdateHumanGradesInAgs::class);
});

it('updates overall grade based on delta value', function () {
    Http::fake();

    $this->putJson('/api/v2/admin/orders/' . $this->order->id . '/cards/' . $this->userCard->id . '/grades', [
        'human_grade_values' => [
            'front' => [
                'center' => 2.50,
                'surface' => 2.50,
                'edge' => 2.50,
                'corner' => 2.50,
            ],
            'back' => [
                'center' => 2.50,
                'surface' => 2.50,
                'edge' => 2.50,
                'corner' => 2.50,
            ],
        ],
        'grade_delta' => 2.5,
    ])
    ->assertOk()
    ->assertJsonFragment(['grade' => 5.0])
    ->assertJsonFragment(['nickname' => 'EX']);
});
