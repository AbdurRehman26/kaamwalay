<?php

namespace App\Services\AGS;

use App\APIClients\AGSClient;
use App\Http\Resources\API\Services\AGS\CardGradeResource;

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

        return CardGradeResource::make($response)->resolve();
    }

    protected function prepareHumanGradeData(array $data): array
    {
        return [
            'front_centering_human_grade' => $data['human_grade_values']['front']['center'],
            'front_surface_human_grade' => $data['human_grade_values']['front']['corner'],
            'front_edges_human_grade' => $data['human_grade_values']['front']['edge'],
            'front_corners_human_grade' => $data['human_grade_values']['front']['corner'],
            'back_centering_human_grade' => $data['human_grade_values']['back']['center'],
            'back_surface_human_grade' => $data['human_grade_values']['back']['corner'],
            'back_edges_human_grade' => $data['human_grade_values']['back']['edge'],
            'back_corners_human_grade' => $data['human_grade_values']['back']['corner'],
        ];
    }

    public function createCertificates(string $certificateIds)
    {
        return $this->client->createCertificates(certificateIds: $certificateIds);
    }
}
