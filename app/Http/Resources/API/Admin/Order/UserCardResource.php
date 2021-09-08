<?php

namespace App\Http\Resources\API\Admin\Order;

use App\Http\Resources\API\BaseResource;

class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'customer' => new OrderCustomerResource($this->user),
            'human_grade_values' => $this->human_grade_values,
            'robo_grade_values' => $this->robo_grade_values,
            'overall_values' => $this->overall_values,
            'overall_grade' => $this->overall_grade,
            'grading_id' => $this->grading_id,
            'ai_model_number' => $this->ai_model_number,
            'front_centering_img_src' => $this->front_centering_img_src,
            'front_surface_img_src' => $this->front_surface_img_src,
            'front_edges_img_src' => $this->front_edges_img_src,
            'front_corners_img_src' => $this->front_corners_img_src,
            'back_centering_img_src' => $this->back_centering_img_src,
            'back_surface_img_src' => $this->back_surface_img_src,
            'back_edges_img_src' => $this->back_edges_img_src,
            'back_corners_img_src' => $this->back_corners_img_src,
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }
}
