<?php

namespace App\Services\Admin;

use App\Models\UserCard;
use Illuminate\Support\Arr;

class CardGradingService
{
    protected const FRONT_AVERAGING_RATIO = 0.6;
    protected const BACK_AVERAGING_RATIO = 0.4;

    protected const GRADE_CRITERIA = [
        'GEM-MT' => 10.00,
        'MINT' => 9.00,
        'NM-MT' => 8.00,
        'NM' => 7.00,
        'EX-MT' => 6.00,
        'EX' => 5.00,
        'VG-EX' => 4.00,
        'VG' => 3.00,
        'GOOD' => 2.00,
        'FR' => 1.50,
        'PR' => 1.00,
    ];

    public function defaultValues(string $node): array
    {
        if ($node === 'overall') {
            return $this->defaultOverallValues();
        } elseif ($node === 'images') {
            return $this->defaultImagesValues();
        }

        return [
            'front' => $this->getDefaultSet(),
            'back' => $this->getDefaultSet(),
        ];
    }

    protected function defaultOverallValues(): array
    {
        return $this->getDefaultSet();
    }

    protected function getDefaultSet(): array
    {
        return [
            'center' => 0.0,
            'surface' => 0.0,
            'edge' => 0.0,
            'corner' => 0.0,
        ];
    }

    protected function defaultImagesValues(): array
    {
        return [
            [
                'output_image' => null,
                'name' => 'Front Centering',
            ],
            [
                'output_image' => null,
                'name' => 'Front Surface',
            ],
            [
                'output_image' => null,
                'name' => 'Front Edges',
            ],
            [
                'output_image' => null,
                'name' => 'Front Corners',
            ],
            [
                'output_image' => null,
                'name' => 'Back Centering',
            ],
            [
                'output_image' => null,
                'name' => 'Back Surface',
            ],
            [
                'output_image' => null,
                'name' => 'Back Edges',
            ],
            [
                'output_image' => null,
                'name' => 'Back Corners',
            ],
        ];
    }

    public function validateIfHumanGradesAreCompleted(array $humanGrades): bool
    {
        return collect($humanGrades)->filter(function ($side) {
            return collect($side)->min() !== 0;
        })->count() === 2;
    }

    public function hasValidGradings(UserCard $card): bool
    {
        return $card->orderItem->isValidForGrading() && ! empty($card->overall_grade)
            && ! empty($card->overall_grade_nickname) && ! empty($card->overall_values)
            && $this->validateIfHumanGradesAreCompleted($card->human_grade_values);
    }

    public function calculateOverallValues(array|string $frontValues): array
    {
        return [
            'center' => (Arr::get($frontValues, 'front.center') * self::FRONT_AVERAGING_RATIO) + (Arr::get($frontValues, 'back.center') * self::BACK_AVERAGING_RATIO),
            'surface' => (Arr::get($frontValues, 'front.edge') * self::FRONT_AVERAGING_RATIO) + (Arr::get($frontValues, 'back.edge') * self::BACK_AVERAGING_RATIO),
            'edge' => (Arr::get($frontValues, 'front.edge') * self::FRONT_AVERAGING_RATIO) + (Arr::get($frontValues, 'back.edge') * self::BACK_AVERAGING_RATIO),
            'corner' => (Arr::get($frontValues, 'front.corner') * self::FRONT_AVERAGING_RATIO) + (Arr::get($frontValues, 'back.corner') * self::BACK_AVERAGING_RATIO),
        ];
    }

    public function calculateOverallAverage(array|string $overAllValues): array
    {
        if (is_string($overAllValues)) {
            $overAllValues = json_decode($overAllValues, associative: true);
        }

        $overallGrade = $this->getAverage($overAllValues['center'], $overAllValues['surface'], $overAllValues['edge'], $overAllValues['corner']);

        return [
            'grade' => $overallGrade,
            'nickname' => $this->getGradeNickname($overallGrade),
        ];
    }

    protected function getAverage(...$values): float
    {
        return number_format((float)(array_sum($values) / count($values)), 2);
    }

    protected function getGradeNickname(float $overallValue): string
    {
        [$greaterGradeValues] = collect(self::GRADE_CRITERIA)
            ->partition(fn ($value) => $value > $this->getRoundedValue($overallValue));

        return array_key_last($greaterGradeValues->all());
    }

    public function getRoundedValue(float $value): float
    {
        $integerValue = (int) $value;
        $decimalValue = round(($value - $integerValue), 2);
        return match (true) {
            ($decimalValue <= 0.25) => number_format($integerValue, 2),
            ($decimalValue <= 0.50), ($decimalValue <= 0.75) => number_format($integerValue + 0.5, 2),
            default => number_format($integerValue + 1, 2),
        };
    }
}
