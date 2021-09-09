<?php

namespace App\Services\Admin\Order\Grading;

use Illuminate\Support\Arr;
use JetBrains\PhpStorm\ArrayShape;
use JetBrains\PhpStorm\Pure;

class CardGradingService
{
    #[Pure]
    public function defaultValues(string $node): array
    {
        return $this->getDefaultValues($node === 'overall');
    }

    #[Pure]
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

    #[Pure] #[ArrayShape(['overall' => "float[]"])]
    protected function defaultOverallValues(): array
    {
        return [
            'overall' => $this->getDefaultSet(),
        ];
    }

    #[ArrayShape(['center' => "float", 'surface' => "float", 'edge' => "float", 'corner' => "float"])]
    protected function getDefaultSet(): array
    {
        return [
            'center' => 0.0,
            'surface' => 0.0,
            'edge' => 0.0,
            'corner' => 0.0,
        ];
    }

    #[ArrayShape(['center' => "float", 'surface' => "float", 'edge' => "float", 'corner' => "float"])]
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
}
