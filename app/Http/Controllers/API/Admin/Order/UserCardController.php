<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\Grades\DeleteUserCardImageRequest;
use App\Http\Requests\API\Admin\Order\Grades\UserCardGradeRequest;
use App\Http\Requests\API\Admin\Order\Grades\UserCardImageRequest;
use App\Http\Resources\API\Admin\Order\UserCardResource;
use App\Models\UserCard;

class UserCardController extends Controller
{
    public function updateGradingValues(UserCardGradeRequest $request, UserCard $userCard): UserCardResource
    {
        $userCard->update(
            $request->only('human_grade_values', 'overall_values', 'overall_grade')
        );

        return new UserCardResource($userCard);
    }

    public function updateImage(UserCardImageRequest $request, UserCard $userCard): UserCardResource
    {
        ['source' => $source, 'field' => $field] = $request->validated();

        $userCard->fill([$field => $source]);
        $userCard->save();

        return new UserCardResource($userCard);
    }

    public function deleteImage(DeleteUserCardImageRequest $request, UserCard $userCard): UserCardResource
    {
        $userCard->fill([$request->get('field') => null]);
        $userCard->save();

        return new UserCardResource($userCard);
    }
}
