<?php

namespace App\Http\Resources\API\V3\Admin\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Models\UserCard;
use Illuminate\Http\Request;

/**
 * @mixin UserCard
 */
class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'certificate_number' => $this->certificate_number,
            'overall_values' => $this->overall_values,
            'human_grade_values' => $this->human_grade_values,
            'generated_images' => $this->generated_images,
            'overall_grade' => $this->overall_grade,
            'overall_grade_nickname' => $this->overall_grade_nickname,
        ];
    }
}
