<?php

namespace App\Http\Resources\API\Services\AGS;

use App\Http\Resources\API\BaseResource;

class CardGradeResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'grading_id' => $this->resource['id'],
            'overall_grade' => $this->resource['grade']['grade'],
            'overall_grade_nickname' => $this->resource['grade']['nickname'],
            'overall_values' => [
                'center' => $this->resource['total_centering_grade']['grade'],
                'surface' => $this->resource['total_surface_grade']['grade'],
                'edge' => $this->resource['total_edges_grade']['grade'],
                'corner' => $this->resource['total_corners_grade']['grade'],
            ],
            'robo_grade_values' => [
                'front' => [
                    'center' => $this->resource['front_scan']['centering_grade']['grade'],
                    'surface' => $this->resource['front_scan']['surface_grade']['grade'],
                    'edge' => $this->resource['front_scan']['edges_grade']['grade'],
                    'corner' => $this->resource['front_scan']['corners_grade']['grade'],
                ],
                'back' => [
                    'center' => $this->resource['back_scan']['centering_grade']['grade'],
                    'surface' => $this->resource['back_scan']['surface_grade']['grade'],
                    'edge' => $this->resource['back_scan']['edges_grade']['grade'],
                    'corner' => $this->resource['back_scan']['corners_grade']['grade'],
                ],
            ],
            'front_centering_img_src' => $this->resource['front_scan']['centering_result']['output_image'],
            'front_surface_img_src' => $this->resource['front_scan']['surface_result']['output_image'],
            'front_edges_img_src' => $this->resource['front_scan']['edges_result']['output_image'],
            'front_corners_img_src' => $this->resource['front_scan']['corners_result']['output_image'],
            'back_centering_img_src' => $this->resource['back_scan']['centering_result']['output_image'],
            'back_surface_img_src' => $this->resource['back_scan']['surface_result']['output_image'],
            'back_edges_img_src' => $this->resource['back_scan']['edges_result']['output_image'],
            'back_corners_img_src' => $this->resource['back_scan']['corners_result']['output_image'],
        ];
    }
}
