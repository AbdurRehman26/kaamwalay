<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Http\Controllers\API\V1\Admin\Order\UserCardController as V1UserCardController;
use App\Http\Resources\API\V2\Admin\UserCard\UserCardCollection;
use App\Http\Resources\API\V2\Admin\UserCard\UserCardResource;
use App\Services\Order\UserCardService;

class UserCardController extends V1UserCardController
{
    public function __construct(
        protected UserCardService $userCardService
    ) {
    }

    public function listCertificates(): UserCardCollection
    {
        $certificates = $this->userCardService->getCertificates();

        return new UserCardCollection($certificates);
    }

    public function getCertificate(string $certificateNumber): UserCardResource
    {
        $certificate = $this->userCardService->getCertificate($certificateNumber);

        return new UserCardResource($certificate);
    }
}
