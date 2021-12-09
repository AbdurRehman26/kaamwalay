<?php

namespace App\Services\AGS;

use App\Http\APIClients\AGSClient;
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

    public function changePassword(array $data): array
    {
        return $this->client->changePassword(data: $data);
    }

    public function updateHumanGrades(string $certificateId, array $data): array
    {
        $response = $this->client->updateHumanGrades($certificateId, $this->prepareHumanGradeData($data));

        return ! empty($response)
            ? CardGradeResource::make($response)->ignoreParams('overall')->resolve()
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
            'overall_centering_grade' => $data['overall_values']['center'],
            'overall_corners_grade' => $data['overall_values']['corner'],
            'overall_edges_grade' => $data['overall_values']['edge'],
            'overall_surface_grade' => $data['overall_values']['surface'],
            'overall_grade' => [
                'grade' => $data['overall_grade'],
                'nickname' => $data['overall_grade_nickname'],
            ],
        ];
    }

    public function createCertificates(array $data): array
    {
        return $this->client->createCertificates($this->prepareDataForCertificate(data: $data));
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

        if (empty($data) || $data['count'] === 0 || (empty($data['results'][0]['grade']) && empty($data['results'][0]['overall_grade']))) {
            return [
                'grades_available' => false,
            ];
        }

        $data = $data['results'][0];

        return [
            'grades_available' => true,
            'certificate_id' => $data['certificate_id'] ?? null,
            'grade' => $this->prepareGradeForPublicPage($data['overall_grade'] ?? $data['grade']),
            'card' => [
                'name' => $data['card']['name'] ?? null,
                'full_name' => ! empty($data['card']) ? $this->getCardFullName($data['card']) : '',
                'image_path' => $data['card']['image_path'] ?? null,
                'type' => 'Pokemon',
                'series' => $data['card']['pokemon_serie']['name'] ?? null,
                'set' => $data['card']['pokemon_set']['name'] ?? null,
                'release_date' => ! empty($data['card']['pokemon_set']['release_date']) ?
                    Carbon::parse($data['card']['pokemon_set']['release_date'])->format('F d, Y') :
                    null,
                'number' => $data['card']['pokemon_set']['cards_number'] ?? null,
            ],
            'overall' => $this->prepareOverallGradesForPublicPage($data),
            'front_scan' => $this->prepareFrontScanGradesForPublicPage($data),
            'back_scan' => $this->prepareBackScanGradesForPublicPage($data),
            'generated_images' => $this->prepareGeneratedImagesForPublicPage($data),
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

    protected function prepareDataForCertificate(array $data): array
    {
        $cardsData = [];
        foreach ($data as $card) {
            $cardData = [
                'certificate_id' => $card['certificate_id'],
                'set_name' => $card['set_name'],
                'card_number' => $card['card_number'],
            ];

            if (! empty($card['edition'])) {
                $cardData['edition'] = $card['edition'];
            }

            if (! empty($card['variant'])) {
                $cardData['variant'] = $card['variant'];
            }

            if (! empty($card['surface'])) {
                $cardData['surface'] = $card['surface'];
            }

            if (! empty($card['card_reference_id'])) {
                $cardData['card_reference_id'] = $card['card_reference_id'];
            }

            $cardsData[] = $cardData;
        }

        return $cardsData;
    }

    protected function prepareGradeForPublicPage(array $grade): array
    {
        return [
            'grade' => $this->preparePreciseValue($grade['grade']),
            'nickname' => $grade['nickname'] ?? null,
        ];
    }

    protected function prepareOverallGradesForPublicPage(array $data): array
    {
        return [
            'centering' => $this->preparePreciseValue($data['overall_centering_grade'] ?? $data['total_centering_grade']['grade']) ?? null,
            'surface' => $this->preparePreciseValue($data['overall_surface_grade'] ?? $data['total_surface_grade']['grade']) ?? null,
            'edges' => $this->preparePreciseValue($data['overall_edges_grade'] ?? $data['total_edges_grade']['grade']) ?? null,
            'corners' => $this->preparePreciseValue($data['overall_corners_grade'] ?? $data['total_corners_grade']['grade']) ?? null,
        ];
    }

    /**
     * It returns precise value for display.
     * e.g. 8.00 will be converted to 8, 8.50 will be converted to 8.5, 8.125 will be converted to 8.1
     *
     * @param  string  $value
     * @return float
     */
    protected function preparePreciseValue(string $value): float
    {
        $gradeValue = (float) $value;

        if (floor($gradeValue) === $gradeValue) {
            return floor($gradeValue);
        } else {
            return round($gradeValue, 1);
        }
    }

    protected function prepareFrontScanGradesForPublicPage(array $data): array
    {
        return [
            'centering' => $data['front_centering_human_grade'] ?? $data['front_scan']['centering_grade']['grade'] ?? null,
            'surface' => $data['front_surface_human_grade'] ?? $data['front_scan']['surface_grade']['grade'] ?? null,
            'edges' => $data['front_edges_human_grade'] ?? $data['front_scan']['edges_grade']['grade'] ?? null,
            'corners' => $data['front_corners_human_grade'] ?? $data['front_scan']['corners_grade']['grade'] ?? null,
        ];
    }

    protected function prepareBackScanGradesForPublicPage(array $data): array
    {
        return [
            'centering' => $data['back_centering_human_grade'] ?? $data['back_scan']['centering_grade']['grade'] ?? null,
            'surface' => $data['back_surface_human_grade'] ?? $data['back_scan']['surface_grade']['grade'] ?? null,
            'edges' => $data['back_edges_human_grade'] ?? $data['back_scan']['edges_grade']['grade'] ?? null,
            'corners' => $data['back_corners_human_grade'] ?? $data['back_scan']['corners_grade']['grade'] ?? null,
        ];
    }

    protected function prepareGeneratedImagesForPublicPage(array $data): array
    {
        $imagesData = [
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
            [
                'output_image' => $data['laser_front_scan']['centering_result']['output_image'] ?? null,
                'name' => 'Laser Front Centering',
            ],
            [
                'output_image' => $data['laser_front_scan']['surface_result']['output_image'] ?? null,
                'name' => 'Laser Front Surface',
            ],
            [
                'output_image' => $data['laser_front_scan']['edges_result']['output_image'] ?? null,
                'name' => 'Laser Front Edges',
            ],
            [
                'output_image' => $data['laser_front_scan']['corners_result']['output_image'] ?? null,
                'name' => 'Laser Front Corners',
            ],
            [
                'output_image' => $data['laser_back_scan']['centering_result']['output_image'] ?? null,
                'name' => 'Laser Back Centering',
            ],
            [
                'output_image' => $data['laser_back_scan']['surface_result']['output_image'] ?? null,
                'name' => 'Laser Back Surface',
            ],
            [
                'output_image' => $data['laser_back_scan']['edges_result']['output_image'] ?? null,
                'name' => 'Laser Back Edges',
            ],
            [
                'output_image' => $data['laser_back_scan']['corners_result']['output_image'] ?? null,
                'name' => 'Laser Back Corners',
            ],
        ];

        return array_filter($imagesData, function (array $imageData) {
            return $imageData['output_image'] !== null;
        });
    }

    public function getCardSeries(array $data): array
    {
        return $this->client->getCardSeries($data);
    }

    public function createCardSeries(array $data): array
    {
        return $this->client->createCardSeries($data);
    }

    public function getCardSet(array $data): array
    {
        return $this->client->getCardSet($data);
    }

    public function createCardSet(array $data): array
    {
        return $this->client->createCardSet($data);
    }

    public function createCard(array $data): array
    {
        return $this->client->createCard($data);
    }
}
