<?php

namespace App\Http\Resources\API\Customer\UserCard;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'overall_grade' => $this->resource->overall_grade,
            'overall_grade_nickname' => $this->resource->overall_grade_nickname,
        ];
    }
}
