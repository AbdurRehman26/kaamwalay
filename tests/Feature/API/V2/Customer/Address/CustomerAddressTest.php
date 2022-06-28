<?php

use App\Models\CustomerAddress;

beforeEach(function () {
    $this->addresses = CustomerAddress::factory()->count(2)->create();
    $this->user = $this->addresses->first()->user;
    $this->actingAs($this->user);
});

test('user can receive addresses', function () {
    $response = $this->getJson(route('v2.customer.addresses.index'));
    $response->assertJsonStructure([
        'data' => [['id', 'first_name', 'last_name', 'state']],
    ]);
});

test('user can receive single address', function () {
    $response = $this->getJson(route('v2.customer.addresses.show', $this->addresses[0]->id));
    $response->assertJsonStructure([
        'data' => ['id', 'first_name', 'last_name', 'state'],
    ]);
});

test('user can not receive other user address', function () {
    $response = $this->getJson(route('v2.customer.addresses.show', $this->addresses[1]->id));
    $response->assertStatus(403);
});

test('a customer can add customer address', function () {
    $this->actingAs($this->user);

    $response = $this->postJson(route('v2.customer.addresses.store'), [
        'country_id' => '1',
        'first_name' => 'First',
        'last_name' => 'Last',
        'address' => 'Test address',
        'address2' => 'Test address 2',
        'city' => 'Test',
        'state' => 'AB',
        'zip' => '12345',
        'phone' => '1234567890'
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'user_id',
            'first_name',
            'last_name',
            'address',
            'address_2',
            'city',
            'state',
            'zip',
            'phone',
            'flat',
            'country',
        ],
    ]);
});

test('a customer can update customer address', function () {
    $this->actingAs($this->user);

    $response = $this->putJson(route('v2.customer.addresses.update', $this->addresses[0]->id), [
        'country_id' => '1',
        'first_name' => 'First',
        'last_name' => 'Last',
        'address' => 'Test address',
        'address2' => 'Test address 2',
        'city' => 'Test',
        'state' => 'AB',
        'zip' => '12345',
        'phone' => '1234567890'
    ]);

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'user_id',
            'first_name',
            'last_name',
            'address',
            'address_2',
            'city',
            'state',
            'zip',
            'phone',
            'flat',
            'country',
        ],
    ]);
});

test('a customer can delete a saved address', function () {
    $this->actingAs($this->user);
    $this->deleteJson(route('v2.customer.addresses.delete', ['address' => $this->addresses[0]->id]))
        ->assertNoContent();
});

test('a customer cannot update address of another customer', function () {

    $response = $this->putJson(route('v2.customer.addresses.update', $this->addresses[1]->id), [
        'customer_address' => [
            'country_id' => '1',
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'address2' => 'Test address 2',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
        ],
    ]);

    $response->assertStatus(403);
});

test('a customer cannot delete address of another customer', function () {
    $response = $this->deleteJson(route('v2.customer.addresses.delete', ['address' => $this->addresses[1]->id]));
    $response->assertStatus(403);
});
