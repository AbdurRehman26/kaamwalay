<?php

use App\Events\API\User\UserAccountDeletedEvent;
use App\Listeners\API\User\UserAccountDeletedListener;
use App\Models\User;

test('Deleted user account event', function () {
    Event::fake();

    $user = User::factory()->create();
    $this->assertNotEmpty($user->first_name);
    $this->assertNotEmpty($user->last_name);
    $this->assertNotEmpty($user->email);
    $this->assertTrue($user->isActive());
    $this->assertFalse($user->trashed());

    UserAccountDeletedEvent::dispatch($user->id);

    Event::assertDispatched(UserAccountDeletedEvent::class);
    Event::assertListening(UserAccountDeletedEvent::class, UserAccountDeletedListener::class);
    Event::dispatched(UserAccountDeletedEvent::class, fn ($event) => $event->userId === $user->id);

    $listener = new UserAccountDeletedListener();
    $listener->handle(new UserAccountDeletedEvent($user->id));

    $user = User::withTrashed()->where('id', $user->id)->first();
    $this->assertSoftDeleted($user);
});
