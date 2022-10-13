<?php

namespace App\Services;

use App\Events\API\User\UserAccountDeletedEvent;
use App\Exceptions\API\Customer\UserAccountCannotBeDeactivatedException;
use App\Exceptions\API\Customer\UserAccountCannotBeDeletedException;
use App\Jobs\ProcessImage;
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

        ProcessImage::dispatchIf(! empty($data['profile_image']), model: $user, columnName: 'profile_image', directory: "users/$user->id/files");

        return $user;
    }

    /**
     * @throws UserAccountCannotBeDeactivatedException
     */
    public function deactivateProfile(User $user): bool
    {
        $response = $this->agsService->deactivateProfile($user);

        if (! isset($response['app_status']) || ! $response['app_status']) {
            throw new UserAccountCannotBeDeactivatedException();
        }

        $this->update($user, ['is_active' => false]);

        return true;
    }

    /**
     * @throws UserAccountCannotBeDeletedException
     */
    public function deleteProfile(User $user): bool
    {
        $response = $this->agsService->deleteProfile($user);

        if (! is_array($response)) {
            throw new UserAccountCannotBeDeletedException();
        }

        UserAccountDeletedEvent::dispatch($user->id);

        $this->update($user, [
            'email' => '',
            'email_verified_at' => null,
            'first_name' => null,
            'last_name' => null,
            'phone' => null,
            'profile_image' => null,
            'ags_access_token' => null,
            'is_active' => false,
        ]);

        return true;
    }
}
