<?php

namespace App\Http\Resources\API\Services\AGS;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;

class CardGradeResource extends BaseResource
{
    protected array $ignoredParams = [];

    public function ignoreParams(...$params): self
    {
        $this->ignoredParams = $params;

        return $this;
    }

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'grading_id' => $this->resource['id'],
            $this->mergeWhen(! in_array('overall', $this->ignoredParams), [
                'overall_grade' => $this->resource['grade']['grade'] ?? 0,
                'overall_grade_nickname' => $this->resource['grade']['nickname'] ?? '',
                'overall_values' => [
                    'center' => $this->resource['total_centering_grade']['grade'] ?? 0,
                    'surface' => $this->resource['total_surface_grade']['grade'] ?? 0,
                    'edge' => $this->resource['total_edges_grade']['grade'] ?? 0,
                    'corner' => $this->resource['total_corners_grade']['grade'] ?? 0,
                ],
            ]),
            'robo_grade_values' => [
                'front' => ! is_null($this->resource['laser_front_scan']) ? [
                    'center' => $this->resource['laser_front_scan']['centering_grade']['grade'],
                    'surface' => $this->resource['laser_front_scan']['surface_grade']['grade'],
                    'edge' => $this->resource['laser_front_scan']['edges_grade']['grade'],
                    'corner' => $this->resource['laser_front_scan']['corners_grade']['grade'],
                ] : null,
                'back' => ! is_null($this->resource['laser_back_scan']) ? [
                    'center' => $this->resource['laser_back_scan']['centering_grade']['grade'],
                    'surface' => $this->resource['laser_back_scan']['surface_grade']['grade'],
                    'edge' => $this->resource['laser_back_scan']['edges_grade']['grade'],
                    'corner' => $this->resource['laser_back_scan']['corners_grade']['grade'],
                ] : null,
            ],
            'generated_images' => [
                [
                    'output_image' => $this->resource['front_scan']['centering_result']['output_image'] ?? null,
                    'name' => 'Front Centering',
                ],
                [
                    'output_image' => $this->resource['front_scan']['surface_result']['output_image'] ?? null,
                    'name' => 'Front Surface',
                ],
                [
                    'output_image' => $this->resource['front_scan']['edges_result']['output_image'] ?? null,
                    'name' => 'Front Edges',
                ],
                [
                    'output_image' => $this->resource['front_scan']['corners_result']['output_image'] ?? null,
                    'name' => 'Front Corners',
                ],
                [
                    'output_image' => $this->resource['back_scan']['centering_result']['output_image'] ?? null,
                    'name' => 'Back Centering',
                ],
                [
                    'output_image' => $this->resource['back_scan']['surface_result']['output_image'] ?? null,
                    'name' => 'Back Surface',
                ],
                [
                    'output_image' => $this->resource['back_scan']['edges_result']['output_image'] ?? null,
                    'name' => 'Back Edges',
                ],
                [
                    'output_image' => $this->resource['back_scan']['corners_result']['output_image'] ?? null,
                    'name' => 'Back Corners',
                ],
                [
                    'output_image' => $this->resource['laser_front_scan']['centering_result']['output_image'] ?? null,
                    'name' => 'Laser Front Centering',
                ],
                [
                    'output_image' => $this->resource['laser_front_scan']['surface_result']['output_image'] ?? null,
                    'name' => 'Laser Front Surface',
                ],
                [
                    'output_image' => $this->resource['laser_front_scan']['edges_result']['output_image'] ?? null,
                    'name' => 'Laser Front Edges',
                ],
                [
                    'output_image' => $this->resource['laser_front_scan']['corners_result']['output_image'] ?? null,
                    'name' => 'Laser Front Corners',
                ],
                [
                    'output_image' => $this->resource['laser_back_scan']['centering_result']['output_image'] ?? null,
                    'name' => 'Laser Back Centering',
                ],
                [
                    'output_image' => $this->resource['laser_back_scan']['surface_result']['output_image'] ?? null,
                    'name' => 'Laser Back Surface',
                ],
                [
                    'output_image' => $this->resource['laser_back_scan']['edges_result']['output_image'] ?? null,
                    'name' => 'Laser Back Edges',
                ],
                [
                    'output_image' => $this->resource['laser_back_scan']['corners_result']['output_image'] ?? null,
                    'name' => 'Laser Back Corners',
                ],
            ],
        ];
    }
}
