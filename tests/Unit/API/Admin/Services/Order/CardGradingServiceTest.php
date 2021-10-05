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

it('successfully verifies that human grades are completed', function (array $data) {
    $this->assertTrue($this->service->validateIfHumanGradesAreCompleted($data));
})->with([
    fn () => ['front' => ['center' => 4.20, 'surface' => 4.20, 'edge' => 4.20, 'corner' => 4.20], 'back' => ['center' => 4.20, 'surface' => 4.20, 'edge' => 4.20, 'corner' => 4.20]],
    fn () => ['front' => ['center' => 9.00, 'surface' => 5.40, 'edge' => 7.20, 'corner' => 3.80], 'back' => ['center' => 6.30, 'surface' => 6.20, 'edge' => 7.70, 'corner' => 7.40]],
    fn () => ['front' => ['center' => 7.00, 'surface' => 9.40, 'edge' => 10.00, 'corner' => 5.60], 'back' => ['center' => 1.20, 'surface' => 1.60, 'edge' => 7.70, 'corner' => 7.40]],
]);

it('successfully verifies that human grades are not completed', function (array $data) {
    $this->assertFalse($this->service->validateIfHumanGradesAreCompleted($data));
})->with([
    fn () => ['front' => ['center' => 0, 'surface' => 4.20, 'edge' => 4.20, 'corner' => 4.20], 'back' => ['center' => 4.20, 'surface' => 4.20, 'edge' => 4.20, 'corner' => 4.20]],
    fn () => ['front' => ['center' => 9.00, 'surface' => 0, 'edge' => 7.20, 'corner' => 3.80], 'back' => ['center' => 6.30, 'surface' => 6.20, 'edge' => 7.70, 'corner' => 0]],
    fn () => ['front' => ['center' => 7.00, 'surface' => 9.40, 'edge' => 10.00, 'corner' => 4.20], 'back' => ['center' => 4.20, 'surface' => 0, 'edge' => 4.20, 'corner' => 4.20]],
    fn () => ['front' => ['center' => 0, 'surface' => 0, 'edge' => 7.20, 'corner' => 3.80], 'back' => ['center' => 6.30, 'surface' => 6.20, 'edge' => 0, 'corner' => 7.40]],
    fn () => ['front' => ['center' => 7.00, 'surface' => 9.40, 'edge' => 10.00, 'corner' => 0], 'back' => ['center' => 1.20, 'surface' => 0, 'edge' => 7.70, 'corner' => 7.40]],
    fn () => ['front' => ['center' => 0, 'surface' => 4.20, 'edge' => 4.20, 'corner' => 4.20], 'back' => ['center' => 4.20, 'surface' => 4.20, 'edge' => 4.20, 'corner' => 4.20]],
    fn () => ['front' => ['center' => 9.00, 'surface' => 0, 'edge' => 7.20, 'corner' => 0], 'back' => ['center' => 6.30, 'surface' => 6.20, 'edge' => 7.70, 'corner' => 0]],
    fn () => ['front' => ['center' => 7.00, 'surface' => 9.40, 'edge' => 10.00, 'corner' => 4.20], 'back' => ['center' => 4.20, 'surface' => 0, 'edge' => 4.20, 'corner' => 4.20]],
    fn () => ['front' => ['center' => 9.00, 'surface' => 0, 'edge' => 7.20, 'corner' => 3.80], 'back' => ['center' => 6.30, 'surface' => 6.20, 'edge' => 0, 'corner' => 7.40]],
    fn () => ['front' => ['center' => 0, 'surface' => 9.40, 'edge' => 10.00, 'corner' => 0], 'back' => ['center' => 1.20, 'surface' => 1.60, 'edge' => 7.70, 'corner' => 7.40]],
]);

test('it returns right rounded values', function () {
    expect($this->service->getRoundedValue(8.2))->toBe(8.0);
    expect($this->service->getRoundedValue(8.26))->toBe(8.5);
    expect($this->service->getRoundedValue(8.55))->toBe(8.5);
    expect($this->service->getRoundedValue(8.85))->toBe(9.0);
});
