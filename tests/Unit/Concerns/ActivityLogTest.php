<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatusHistory;
use App\Models\OrderPayment;
use App\Models\OrderShipment;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Model;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    $this->seed(RolesSeeder::class);
    $this->admin = User::factory()->admin()->withRole(config('permission.roles.admin'))->create();
    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create();
});

it('logs activity when model is created by admin', function (Model $model) {
    assertDatabaseHas('activity_log', [
        'description' => 'created',
        'subject_type' => $model::class,
        'event' => 'created',
        'subject_id' => $model->id,
        'causer_type' => User::class,
        'causer_id' => $this->admin->id,
    ]);
})->with('modelsByAdmin');

it('logs activity when model is updated by admin', function (Model $model) {
    $model->id = 100;
    $model->save();

    assertDatabaseHas('activity_log', [
        'description' => 'updated',
        'subject_type' => $model::class,
        'event' => 'updated',
        'subject_id' => $model->id,
        'causer_type' => User::class,
        'causer_id' => $this->admin->id,
    ]);
})->with('modelsByAdmin');

it('does not log activity when model is created by customer', function (Model $model) {
    assertDatabaseMissing('activity_log', [
        'description' => 'created',
        'subject_type' => $model::class,
        'event' => 'created',
        'subject_id' => $model->id,
        'causer_type' => User::class,
        'causer_id' => $this->customer->id,
    ]);
})->with([
    function() {
        $this->actingAs($this->customer);
        return Order::factory()->create();
    },
]);

dataset('modelsByAdmin', function () {
    yield function () {
        $this->actingAs($this->admin);
        return Order::factory()->create();
    };
    yield function () {
        $this->actingAs($this->admin);
        return OrderItem::factory()->create();
    };
    yield function () {
        $this->actingAs($this->admin);
        return OrderItemStatusHistory::factory()->create();
    };
    yield function () {
        $this->actingAs($this->admin);
        return OrderPayment::factory()->create();
    };
    yield function () {
        $this->actingAs($this->admin);
        return OrderShipment::factory()->create();
    };
    yield function () {
        $this->actingAs($this->admin);
        return OrderStatusHistory::factory()->create();
    };
    yield function () {
        $this->actingAs($this->admin);
        return UserCard::factory()->create();
    };
});
