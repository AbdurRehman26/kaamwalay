<?php

use App\Models\User;
use App\Models\UserCardCertificate;
use Database\Seeders\RolesSeeder;
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
    $this->putJson('/api/admin/orders/' . $this->order->id . '/cards/' . $this->userCard->id . '/grades', [
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

it('stores the human grades and update data on AGS', function () {
    Http::fake([
        'https://ags.api/v2/robograding/certificates/?certificate_id=' . $this->userCardCertificate->number =>
            Http::response(json_decode(file_get_contents(
                base_path() . '/tests/stubs/AGS_patch_human_grade_response_200.json'
            ), associative: true)),
    ]);
    $this->putJson('/api/admin/orders/' . $this->order->id . '/cards/' . $this->userCard->id . '/grades', [
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
    ->assertJsonCount(16, 'data.generated_images')
    ->assertJsonCount(4, 'data.overall_values')
    ->assertJsonCount(2, 'data.grade');

    Http::assertSent(function ($request) {
        return $request->url() == 'https://ags.api/v2/robograding/certificates/?certificate_id=' . $this->userCardCertificate->number;
    });
});

it('updates overall grade with delta and update data on AGS', function () {
    Http::fake([
        'https://ags.api/v2/robograding/certificates/?certificate_id=' . $this->userCardCertificate->number =>
            Http::response(json_decode(file_get_contents(
                base_path() . '/tests/stubs/AGS_patch_human_grade_response_200.json'
            ), associative: true)),
    ]);

    $this->putJson('/api/admin/orders/' . $this->order->id . '/cards/' . $this->userCard->id . '/grades', [
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
    ]);

    $this->putJson('/api/admin/orders/' . $this->order->id . '/cards/' . $this->userCard->id . '/grade-delta', [
        'grade_delta' => 2.5
    ])
    ->assertOk()
    ->assertJsonFragment(['grade' => 5.0])
    ->assertJsonFragment(['nickname' => 'EX']);

    Http::assertSent(function ($request) {
        return $request->url() == 'https://ags.api/v2/robograding/certificates/?certificate_id=' . $this->userCardCertificate->number;
    });
});
