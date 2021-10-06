<?php

namespace App\Http\Controllers\API\Customer\Cards;

use App\Exceptions\API\Customer\Cards\CardDoesNotBelongToUser;
use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\UserCard\UserCardListCollection;
use App\Http\Resources\API\Customer\UserCard\UserCardResource;
use App\Models\User;
use App\Models\UserCard;
use App\Services\Order\UserCardService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class UserCardController extends Controller
{
    public function __construct(
        private UserCardService $userCardService,
    ) {
    }

    public function index(User $user): UserCardListCollection
    {
        $this->authorize('viewCards', $user);

        return new UserCardListCollection(
            $this->userCardService->getCustomerCards($user)
        );
    }

    public function show(User $user, UserCard $userCard): UserCardResource | JsonResponse
    {
        $this->authorize('view', $userCard);

        try {
            $card = $this->userCardService->getCustomerCard($user, $userCard);

            return new UserCardResource($card);
        } catch (CardDoesNotBelongToUser $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
