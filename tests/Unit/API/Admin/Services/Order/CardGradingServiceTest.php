<?php

use App\Exceptions\Services\Admin\CardGradeIsInvalid;
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

test('it returns overall rounded values', function () {
    $overallValues = $this->service->calculateOverallValues([
        'front' => [
            'center' => 6.50,
            'surface' => 5.43,
            'edge' => 9.77,
            'corner' => 6.23,
        ],
        'back' => [
            'center' => 8.50,
            'surface' => 7.43,
            'edge' => 6.77,
            'corner' => 10.00,
        ],
    ]);

    expect($overallValues)
        ->toBeArray()
        ->center->toBe(7.30)
        ->surface->toBe(6.23)
        ->edge->toBe(8.57)
        ->corner->toBe(7.74);
});

test('it returns right nicknames', function ($value) {
    $class = new ReflectionClass($this->service::class);
    $method = $class->getMethod('getGradeNickname');
    $method->setAccessible(true);

    expect($method->invokeArgs($this->service, [$value['value']]))->toBe($value['grade']);
})->with([
    fn () => (['value' => 10.00, 'grade' => 'GEM-MT']),
    fn () => (['value' => 9.50, 'grade' => 'MINT+']),
    fn () => (['value' => 9.00, 'grade' => 'MINT']),
    fn () => (['value' => 8.50, 'grade' => 'NM-MT+']),
    fn () => (['value' => 8.00, 'grade' => 'NM-MT']),
    fn () => (['value' => 7.50, 'grade' => 'NM+']),
    fn () => (['value' => 7.00, 'grade' => 'NM']),
    fn () => (['value' => 6.50, 'grade' => 'EX-MT+']),
    fn () => (['value' => 6.00, 'grade' => 'EX-MT']),
    fn () => (['value' => 5.50, 'grade' => 'EX+']),
    fn () => (['value' => 5.00, 'grade' => 'EX']),
    fn () => (['value' => 4.50, 'grade' => 'VG-EX+']),
    fn () => (['value' => 4.00, 'grade' => 'VG-EX']),
    fn () => (['value' => 3.50, 'grade' => 'VG+']),
    fn () => (['value' => 3.00, 'grade' => 'VG']),
    fn () => (['value' => 2.50, 'grade' => 'GOOD+']),
    fn () => (['value' => 2.00, 'grade' => 'GOOD']),
    fn () => (['value' => 1.50, 'grade' => 'FR']),
    fn () => (['value' => 1.00, 'grade' => 'PR']),
]);

test('it returns overall average and nickname', function ($value) {
    expect(
        $this->service->calculateOverallAverage($value['overall'])
    )->toBe($value['grade']);
})->with([
    fn () => (['overall' => ['center' => 6.50,'surface' => 5.00,'edge' => 9.80,'corner' => 2.25], 'grade' => 6.00, 'nickname' => 'EX-MT']),
    fn () => (['overall' => ['center' => 9.50,'surface' => 7.00,'edge' => 9.00,'corner' => 8.25], 'grade' => 8.50, 'nickname' => 'NM-MT+']),
]);

test('it returns right rounded values', function () {
    $class = new ReflectionClass($this->service::class);
    $method = $class->getMethod('getRoundedValue');
    $method->setAccessible(true);
    expect($method->invokeArgs($this->service, [8.2]))->toBe(8.0);
    expect($method->invokeArgs($this->service, [8.26]))->toBe(8.5);
    expect($method->invokeArgs($this->service, [8.55]))->toBe(8.5);
    expect($method->invokeArgs($this->service, [8.85]))->toBe(9.0);
});

it('throws exception if grade values for calculation are invalid', function (float $grade, float $delta) {
    $this->service->addDeltaValueToOverallGrade(7, 4);
})->with([
    [7, 4],
    [2, -5],
])->throws(CardGradeIsInvalid::class, 'Overall grade can not be greater than 10 or less than 1.');
