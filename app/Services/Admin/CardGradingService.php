<?php

namespace App\Services\Admin;

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


    public function validateIfHumanGradesAreCompleted(array $humanGrades): bool
    {
        return collect($humanGrades)->filter(function ($side) {
            return collect($side)->min() !== 0;
        })->count() === 2;
    }
}
