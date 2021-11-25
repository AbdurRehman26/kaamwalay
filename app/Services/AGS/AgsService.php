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
        return $this->client->createCertificates(data: $data);
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
        // $data = $this->getGradesByCertificateId($certificateId);

        $data = '{
            "count": 1,
            "next": null,
            "previous": null,
            "results": [{
                "id": "497e4591-0bf2-4518-8af2-b1c8c4cae3b9",
                "certificate_id": "00001479",
                "scan_version": "/api/v2",
                "filename": "lugia_neo_genesis",
                "grade": null,
                "final_value_to_compare": null,
                "card": {
                    "id": 12336,
                    "set_id": 122,
                    "name": "Lugia",
                    "rarity": "Rare",
                    "card_number": "9/111",
                    "set_name": "Neo Genesis",
                    "image_path": "https://den-cards.pokellector.com/113/Lugia.N1.9.png",
                    "card_url": "https://www.pokellector.com/card/Lugia-Neo-Genesis-N1-9",
                    "image_bucket_path": "https://wooter-ags-database-cards.s3.amazonaws.com/pokemon_cards_images/cards_images/Lugia.N1.9.png",
                    "pokemon_set": {
                        "id": 122,
                        "serie_id": 14,
                        "name": "Neo Genesis",
                        "description": "This is the first set to include Gen II (Johto Region) pokemon",
                        "cards_number": 111,
                        "secret_cards": -1,
                        "release_date": "2000-06-11",
                        "image_path": "https://den-media.pokellector.com/logos/Neo-Genesis.logo.113.png",
                        "image_bucket_path": "https://wooter-ags-database-cards.s3.amazonaws.com/pokemon_cards_images/sets_images/Neo-Genesis.logo.113.png",
                        "set_url": "https://www.pokellector.com/sets/N1-Neo-Genesis"
                    },
                    "pokemon_serie": {
                        "id": 14,
                        "name": "Neo Genesis Series",
                        "image_path": "https://den-media.pokellector.com/logos/Neo-Genesis.logo.113.png",
                        "image_bucket_path": "https://wooter-ags-database-cards.s3.amazonaws.com/pokemon_cards_images/series_images/Neo-Genesis.logo.113.png"
                    },
                    "variant_category": "Edition",
                    "variant_name": "Unlimited",
                    "holo_type": ""
                },
                "front_scan": null,
                "back_scan": null,
                "total_centering_grade": null,
                "total_corners_grade": null,
                "total_edges_grade": null,
                "total_surface_grade": null,
                "total_centering_value_to_compare": null,
                "total_corners_value_to_compare": null,
                "total_edges_value_to_compare": null,
                "total_surface_value_to_compare": null,
                "front_centering_human_grade": "8.50",
                "front_corners_human_grade": "9.00",
                "front_edges_human_grade": "9.00",
                "front_surface_human_grade": "6.00",
                "back_centering_human_grade": "8.50",
                "back_corners_human_grade": "8.50",
                "back_edges_human_grade": "6.50",
                "back_surface_human_grade": "5.50",
                "overall_centering_grade": "8.50",
                "overall_corners_grade": "8.80",
                "overall_edges_grade": "8.00",
                "overall_surface_grade": "5.80",
                "overall_grade": {
                    "grade": 8,
                    "nickname": "NM-MT"
                },
                "laser_grade": {
                    "grade": "9.00",
                    "nickname": "MINT"
                },
                "laser_total_centering_grade": {
                    "grade": "10.00",
                    "nickname": "GEM-MT"
                },
                "laser_total_corners_grade": {
                    "grade": "8.00",
                    "nickname": "NM-MT"
                },
                "laser_total_edges_grade": {
                    "grade": "8.00",
                    "nickname": "NM-MT"
                },
                "laser_total_surface_grade": {
                    "grade": "6.00",
                    "nickname": "EX-MT"
                },
                "laser_front_scan": {
                    "centering_grade": {
                        "grade": "10.00",
                        "nickname": "GEM-MT"
                    },
                    "corners_grade": {
                        "grade": "8.00",
                        "nickname": "NM-MT"
                    },
                    "edges_grade": {
                        "grade": "10.00",
                        "nickname": "GEM-MT"
                    },
                    "surface_grade": {
                        "grade": "6.00",
                        "nickname": "EX-MT"
                    },
                    "centering_result": {
                        "id": "b49a5e40-7f45-4177-bdee-be26cac82296",
                        "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/centering/centering_front_lugia_neo_genesis.jpg",
                        "results": {
                            "dif_x": 0.0005283707296191547,
                            "dif_y": 0.0015481882813665486,
                            "grade": 9.5
                        }
                    },
                    "corners_result": {
                        "id": "568e19f7-9e6b-475c-8e5a-44cd9d097e93",
                        "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/corners/corners_front_lugia_neo_genesis.jpg",
                        "results": {
                            "grade": 8.0,
                            "minor_defect": {
                                "pct_pixels": 0.0,
                                "split_pct_pixels": [0.0, 0.0, 0.0, 0.0]
                            }
                        }
                    },
                    "edges_result": {
                        "id": "b40c6c2e-0336-4d4e-b4b0-eff5844178bc",
                        "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/edges/edges_front_lugia_neo_genesis.jpg",
                        "results": {
                            "grade": 9.5,
                            "minor_defect": {
                                "pct_pixels": 0.11720802001329812,
                                "split_pct_pixels": [0.07551364893706905, 0.041694371076229066, 0.0, 0.0]
                            }
                        }
                    },
                    "surface_result": {
                        "id": "c875bdc6-82f6-44b6-adbd-e25653fbec50",
                        "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/surface/surface_front_lugia_neo_genesis.jpg",
                        "results": {
                            "grade": 6.0,
                            "minor_defect": {
                                "pct_pixels": 10.697602389987473,
                                "split_pct_pixels": [7.065898688188554, 2.86719975460934, 0.5765808044258484, 0.18792314276373068]
                            }
                        }
                    },
                    "input_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/front/lugia_neo_genesis_front.jpg"
                },
                "laser_back_scan": {
                    "centering_grade": {
                        "grade": "9.00",
                        "nickname": "MINT"
                    },
                    "corners_grade": {
                        "grade": "9.00",
                        "nickname": "MINT"
                    },
                    "edges_grade": {
                        "grade": "7.00",
                        "nickname": "NM"
                    },
                    "surface_grade": {
                        "grade": "6.00",
                        "nickname": "EX-MT"
                    },
                    "centering_result": {
                        "id": "4c82d357-99ad-4a86-8204-672ce56743e8",
                        "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/centering/centering_back_lugia_neo_genesis.jpg",
                        "results": {
                            "dif_x": 0.0026064893231771474,
                            "dif_y": 0.0015775160849179908,
                            "grade": 9.0
                        }
                    },
                    "corners_result": {
                        "id": "06e71c03-4f07-4fd9-8540-227d3040e258",
                        "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/corners/corners_back_lugia_neo_genesis.jpg",
                        "results": {
                            "grade": 9.0,
                            "minor_defect": {
                                "pct_pixels": 0.00860894784194339,
                                "split_pct_pixels": [0.00860894784194339, 0.0, 0.0, 0.0]
                            }
                        }
                    },
                    "edges_result": {
                        "id": "6a899962-8613-4e7f-930e-36e03fb7723c",
                        "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/edges/edges_back_lugia_neo_genesis.jpg",
                        "results": {
                            "grade": 7.0,
                            "minor_defect": {
                                "pct_pixels": 0.5469321956972248,
                                "split_pct_pixels": [0.32872406439676644, 0.2182081313004585, 0.0, 0.0]
                            }
                        }
                    },
                    "surface_result": {
                        "id": "ec234bba-9f83-45a2-ab33-1077796cd9a5",
                        "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/surface/surface_back_lugia_neo_genesis.jpg",
                        "results": {
                            "grade": 6.0,
                            "minor_defect": {
                                "pct_pixels": 11.017260825637125,
                                "split_pct_pixels": [3.9791934357117063, 3.0066004229174323, 2.63022870186479, 1.4012382651431967]
                            }
                        }
                    },
                    "input_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/back/lugia_neo_genesis_back.jpg"
                },
                "graded_via": {
                    "username": "robograding",
                    "email": "",
                    "name": "",
                    "date_joined": "2021-09-10 17:28:56"
                },
                "is_testing": false,
                "timestamp": "2021-10-20 03:13:05"
            }],
            "app_status": 1,
            "app_message": "OK"
        }';

        $data = json_decode($data, true); 

        if (empty($data) || $data['count'] === 0 || (empty($data['results'][0]['grade']) && empty($data['results'][0]['overall_grade']))) {
            return [
                'grades_available' => false,
            ];
        }
        $data = $data['results'][0];
        // dd($data);

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
        return [
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
    }
}
