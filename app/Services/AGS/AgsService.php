<?php

namespace App\Services\AGS;

use App\APIClients\AGSClient;
use App\Http\Resources\API\Services\AGS\CardGradeResource;
use Carbon\Carbon;

class AgsService
{
    public function __construct(protected AGSClient $client)
    {
    }

    public function isEnabled(): bool
    {
        return (bool) config('services.ags.is_platform_enabled');
    }

    public function login(array $data): array
    {
        return $this->client->login(data: $data);
    }

    public function register(array $data): array
    {
        return $this->client->register(data: $data);
    }

    public function updateHumanGrades(string $certificateId, array $data): array
    {
        $response = $this->client->updateHumanGrades($certificateId, $this->prepareHumanGradeData($data));

        return ! empty($response)
            ? CardGradeResource::make($response)->resolve()
            : [];
    }

    protected function prepareHumanGradeData(array $data): array
    {
        return [
            'front_centering_human_grade' => $data['human_grade_values']['front']['center'],
            'front_surface_human_grade' => $data['human_grade_values']['front']['surface'],
            'front_edges_human_grade' => $data['human_grade_values']['front']['edge'],
            'front_corners_human_grade' => $data['human_grade_values']['front']['corner'],
            'back_centering_human_grade' => $data['human_grade_values']['back']['center'],
            'back_surface_human_grade' => $data['human_grade_values']['back']['surface'],
            'back_edges_human_grade' => $data['human_grade_values']['back']['edge'],
            'back_corners_human_grade' => $data['human_grade_values']['back']['corner'],
        ];
    }

    public function createCertificates(string $certificateIds): array
    {
        return $this->client->createCertificates(certificateIds: $certificateIds);
    }

    public function getGrades(array $certificateIds): array
    {
        return $this->client->getGrades([
            'certificate_ids' => implode(',', $certificateIds),
        ]);
    }

    public function getGradesByCertificateId(string $certificateId): array
    {
        return $this->client->getGrades([
            'certificate_ids' => $certificateId,
        ]);
    }

    public function getGradesForPublicPage(string $certificateId): array
    {
        $data = $this->getGradesByCertificateId($certificateId);

        if (empty($data) || $data['count'] === 0 || empty($data['results'][0]['grade'])) {
            return [
                'grades_available' => false,
            ];
        }

        $data = $data['results'][0];

        return [
            'grades_available' => true,
            'certificate_id' => $data['certificate_id'] ?? null,
            'grade' => [
                'grade' => $data['grade']['grade'] ?? null,
                'nickname' => $data['grade']['nickname'] ?? null,
            ],
            'card' => [
                'name' => $data['card']['name'] ?? null,
                'full_name' => $this->getCardFullName($data['card']) ?? null,
                'image_path' => $data['card']['image_path'] ?? null,
                'type' => 'Pokemon',
                'series' => $data['card']['pokemon_serie']['name'] ?? null,
                'set' => $data['card']['pokemon_set']['name'] ?? null,
                'release_date' => Carbon::parse($data['card']['pokemon_set']['release_date'])->format('F d, Y') ?? null,
                'number' => $data['card']['pokemon_set']['cards_number'] ?? null,
            ],
            'overall' => [
                'centering' => $data['total_centering_grade']['grade'] ?? null,
                'surface' => $data['total_surface_grade']['grade'] ?? null,
                'edges' => $data['total_edges_grade']['grade'] ?? null,
                'corners' => $data['total_corners_grade']['grade'] ?? null,
            ],
            'front_scan' => [
                'centering' => $data['front_scan']['centering_grade']['grade'] ?? null,
                'surface' => $data['front_scan']['surface_grade']['grade'] ?? null,
                'edges' => $data['front_scan']['edges_grade']['grade'] ?? null,
                'corners' => $data['front_scan']['corners_grade']['grade'] ?? null,
            ],
            'back_scan' => [
                'centering' => $data['back_scan']['centering_grade']['grade'] ?? null,
                'surface' => $data['back_scan']['surface_grade']['grade'] ?? null,
                'edges' => $data['back_scan']['edges_grade']['grade'] ?? null,
                'corners' => $data['back_scan']['corners_grade']['grade'] ?? null,
            ],
            'generated_images' => [
                [
                    'output_image' => $data['front_scan']['centering_result']['output_image'] ?? null,
                    'name' => 'Front Centering',
                ],
                [
                    'output_image' => $data['front_scan']['surface_result']['output_image'] ?? null,
                    'name' => 'Front Surface',
                ],
                [
                    'output_image' => $data['front_scan']['edges_result']['output_image'] ?? null,
                    'name' => 'Front Edges',
                ],
                [
                    'output_image' => $data['front_scan']['corners_result']['output_image'] ?? null,
                    'name' => 'Front Corners',
                ],
                [
                    'output_image' => $data['back_scan']['centering_result']['output_image'] ?? null,
                    'name' => 'Back Centering',
                ],
                [
                    'output_image' => $data['back_scan']['surface_result']['output_image'] ?? null,
                    'name' => 'Back Surface',
                ],
                [
                    'output_image' => $data['back_scan']['edges_result']['output_image'] ?? null,
                    'name' => 'Back Edges',
                ],
                [
                    'output_image' => $data['back_scan']['corners_result']['output_image'] ?? null,
                    'name' => 'Back Corners',
                ],
            ],
        ];
    }

    protected function getCardFullName(array $card): string
    {
        return Carbon::parse($card['pokemon_set']['release_date'])->year . ' ' .
            'Pokemon' . ' ' .
            $card['pokemon_serie']['name'] . ' ' .
            $card['pokemon_set']['name'] . ' ' .
            $card['pokemon_set']['cards_number'] . ' ' .
            $card['name'];
    }
}
