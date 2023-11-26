<?php

namespace App\Http\Controllers\API\V2\Customer\Cards;

use App\Http\Controllers\API\V1\Customer\Cards\UserCardController as V1UserCardController;
use App\Http\Requests\API\V2\Customer\Cards\UserCardsOwnershipChangeRequest;
use App\Services\Order\UserCardService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class UserCardController extends V1UserCardController
{
    public function __construct(private UserCardService $userCardService)
    {
        parent::__construct($userCardService);
    }

    public function changeOwnership(UserCardsOwnershipChangeRequest $ownershipChangeRequest): JsonResponse
    {
        try {
            $this->userCardService->changeOwnership($ownershipChangeRequest->safe()->only(['user_id', 'user_card_ids']));

            return new JsonResponse(['success' => true], Response::HTTP_OK);
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
