<?php

namespace App\Http\Controllers\API\V1\Customer\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Customer\UserCard\UserCardListCollection;
use App\Http\Resources\API\V1\Customer\UserCard\UserCardResource;
use App\Models\UserCard;
use App\Services\Order\UserCardService;
use Illuminate\Http\JsonResponse;

class UserCardController extends Controller
{
    public function __construct(
        private UserCardService $userCardService,
    ) {
    }

    public function index(): UserCardListCollection
    {
        return new UserCardListCollection(
            $this->userCardService->getCustomerCards(auth()->user())
        );
    }

    public function show(UserCard $userCard): UserCardResource|JsonResponse
    {
        $this->authorize('view', $userCard);

        return new UserCardResource($userCard);
    }
}
