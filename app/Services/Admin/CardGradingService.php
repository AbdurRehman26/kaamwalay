<?php

namespace App\Services\Admin;

use App\Models\UserCard;

class CardGradingService
{
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
}
