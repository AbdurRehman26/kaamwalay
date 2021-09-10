<?php

use App\Services\Admin\CardGradingService;

beforeEach(fn () => $this->service = new CardGradingService);

uses()->group('admin', 'grading');

it('can return the default values for human and robo grade values', function (array $defaultSet) {
    expect($defaultSet)
        ->toBeArray()
        ->toHaveKeys(['front', 'back'])
        ->each
        ->toMatchArray([
            'center' => 0.0,
            'surface' => 0.0,
            'edge' => 0.0,
            'corner' => 0.0,
        ]);
})->with([
    fn () => $this->service->defaultValues('human'),
    fn () => $this->service->defaultValues('robo'),
]);

it('can return the default values for overall_values', function (array $defaultSet) {
    expect($defaultSet)->toBeArray()->toHaveKeys(['center', 'surface', 'edge', 'corner'])->each->toBe(0.0);
})->with([
    fn () => $this->service->defaultValues('overall'),
]);

it('calculates the overall grading values', function () {
    $humanGrades = [
        'front' => [
            'center' => 5.5,
            'surface' => 6.2,
            'edge' => 7.3,
            'corner' => 9.0,
        ],
        'back' => [
            'center' => 7.5,
            'surface' => 2.5,
            'edge' => 8.6,
            'corner' => 5.0,
        ],
    ];
    $overAllValues = $this->service->calculateOverallValues($humanGrades);
    expect($overAllValues)
        ->toBeArray()
        ->toHaveKeys(['center', 'surface', 'edge', 'corner'])
        ->center->toBe(6.5)
        ->surface->toBe(4.4)
        ->edge->toBe(8.0)
        ->corner->toBe(7.0);
});

it('calculates overall grade average', function () {
    $overAllValues = [
        'center' => 5.5,
        'surface' => 6.2,
        'edge' => 7.3,
        'corner' => 9.0,
    ];
    $overAllGrade = $this->service->calculateOverallAverage($overAllValues);
    expect($overAllGrade)->toBe(7.0);
});
