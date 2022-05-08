<?php

namespace App\Services;

use App\Events\API\User\UserAccountDeletedEvent;
use App\Models\User;
use App\Services\AGS\AgsService;

class CustomerProfileService
{
    public function __construct(
        protected AgsService $agsService
    ) {
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user;
    }

    public function deactivateAccount(User $user): bool
    {
        $this->agsService->deactivateAccount($user);

        $this->update($user, ['active' => false]);

        return true;
    }

    public function deleteAccount(User $user): bool
    {
        $this->agsService->deleteAccount($user);

        UserAccountDeletedEvent::dispatch($user->id);

        $this->update($user, [
            'email' => '',
            'email_verified_at' => null,
            'first_name' => null,
            'last_name' => null,
            'phone' => null,
            'profile_image' => null,
            'ags_access_token' => null,
            'active' => false,
        ]);

        return true;
    }
}
