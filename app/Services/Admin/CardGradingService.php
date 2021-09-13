<?php

namespace App\Services\Admin;

use Illuminate\Support\Arr;

class CardGradingService
{
    public function defaultValues(string $node): array
    {
        return $this->getDefaultValues($node === 'overall');
    }

    protected function getDefaultValues($isOverall): array
    {
        if ($isOverall) {
            return $this->defaultOverallValues();
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


    public function calculateOverallValues(array | string $frontValues): array
    {
        if (is_string($frontValues)) {
            $frontValues = json_decode($frontValues, associative: true);
        }

        return [
            'center' => $this->getAverage(Arr::get($frontValues, 'front.center'), Arr::get($frontValues, 'back.center')),
            'surface' => $this->getAverage(Arr::get($frontValues, 'front.surface'), Arr::get($frontValues, 'back.surface')),
            'edge' => $this->getAverage(Arr::get($frontValues, 'front.edge'), Arr::get($frontValues, 'back.edge')),
            'corner' => $this->getAverage(Arr::get($frontValues, 'front.corner'), Arr::get($frontValues, 'back.corner')),
        ];
    }

    public function calculateOverallAverage(array | string $overAllValues): float
    {
        if (is_string($overAllValues)) {
            $overAllValues = json_decode($overAllValues, associative: true);
        }

        return $this->getAverage($overAllValues['center'], $overAllValues['surface'], $overAllValues['edge'], $overAllValues['corner']);
    }

    protected function getAverage(...$values): float
    {
        if (count($values) === 0) {
            return 0.0;
        }

        return number_format((float) (array_sum($values) / count($values)), 1);
    }

    public function validateIfHumanGradesAreCompleted(array $humanGrades): bool
    {
        return collect($humanGrades)->filter(function ($side) {
            return collect($side)->min() !== 0;
        })->count() === 2;
    }
}
