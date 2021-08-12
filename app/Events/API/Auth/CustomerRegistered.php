<?php

namespace App\Events\API\Auth;

use App\Http\Requests\API\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CustomerRegistered
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        public User $user,
        public array $request
    ) {
    }
}
