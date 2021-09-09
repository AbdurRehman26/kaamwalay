<?php

use App\Services\Admin\Order\Grading\CardGradingService;

beforeEach(function () {
    $this->service = new CardGradingService;
});
it('can return the default values for human_grade_values', function () {
    $defaultSet = $this->service->defaultValues('human');

    expect($defaultSet)
        ->toBeArray()
        ->toHaveKeys(['front', 'back'])
        ->front
        ->toBeArray()
        ->toMatchArray([
            'center' => 0.0,
            'surface' => 0.0,
            'edge' => 0.0,
            'corner' => 0.0,
        ])
        ->back
        ->toBeArray()
        ->toMatchArray([
            'center' => 0.0,
            'surface' => 0.0,
            'edge' => 0.0,
            'corner' => 0.0,
        ]);
})->group('admin', 'grading');

it('can return the default values for robo_grade_values', function () {
    $defaultSet = $this->service->defaultValues('robo');

    expect($defaultSet)
        ->toBeArray()
        ->toHaveKeys(['front', 'back'])
        ->front
        ->toBeArray()
        ->toMatchArray([
            'center' => 0.0,
            'surface' => 0.0,
            'edge' => 0.0,
            'corner' => 0.0,
        ])
        ->back
        ->toBeArray()
        ->toMatchArray([
            'center' => 0.0,
            'surface' => 0.0,
            'edge' => 0.0,
            'corner' => 0.0,
        ]);
})->group('admin', 'grading');

it('can return the default values for overall_values', function () {
    $defaultSet = $this->service->defaultValues('overall');

    expect($defaultSet)
        ->toBeArray()
        ->toMatchArray([
            'center' => 0.0,
            'surface' => 0.0,
            'edge' => 0.0,
            'corner' => 0.0,
        ]);
})->group('admin', 'grading');

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
})->group('admin', 'grading');

it('calculates overall grade average', function () {
    $overAllValues = [
        'center' => 5.5,
        'surface' => 6.2,
        'edge' => 7.3,
        'corner' => 9.0,
    ];
    $overAllGrade = $this->service->calculateOverallAverage($overAllValues);
    expect($overAllGrade)->toBe(7.0);
})->group('admin', 'grading');
