<?php

use App\Models\UserCard;

use function Pest\Laravel\postJson;

beforeEach(function () {
    config(['webhook-client.configs.0.signing_secret' => 'secret']);
    $this->secret = config('webhook-client.configs.0.signing_secret');
    $this->body = file_get_contents(base_path('/tests/stubs/CVAT_grades_webhook.json'));
    $this->event = json_decode($this->body, true, 512, JSON_THROW_ON_ERROR);
    $this->body = json_encode($this->event, JSON_THROW_ON_ERROR);
    $this->card = UserCard::factory()->create([
        'certificate_number' => $this->event['values']['certificateId'],
    ]);
});

it('should correctly set the cvat grades', function () {
    $signature = hash_hmac('sha256', json_encode($this->event, JSON_THROW_ON_ERROR), $this->secret);
    $res = postJson('/webhooks/cvat-grades', $this->event, [
        'Signature' => $signature,
    ]);

    $res->assertOk();
    $this->card->refresh();

    $humanGradeValues = $this->card->human_grade_values;
    $overallGrade = $this->card->overall_grade;
    $overallGradeNickname = $this->card->overall_grade_nickname;

    expect($humanGradeValues['back']['center'])->toBe($this->event['values']['grades']['back_centering_human_grade']);
    expect($humanGradeValues['back']['edge'])->toBe($this->event['values']['grades']['back_edges_human_grade']);
    expect($humanGradeValues['back']['corner'])->toBe($this->event['values']['grades']['back_corners_human_grade']);
    expect($humanGradeValues['back']['surface'])->toBe($this->event['values']['grades']['back_surface_human_grade']);

    expect($humanGradeValues['front']['center'])->toBe($this->event['values']['grades']['front_centering_human_grade']);
    expect($humanGradeValues['front']['edge'])->toBe($this->event['values']['grades']['front_edges_human_grade']);
    expect($humanGradeValues['front']['corner'])->toBe($this->event['values']['grades']['front_corners_human_grade']);
    expect($humanGradeValues['front']['surface'])->toBe($this->event['values']['grades']['front_surface_human_grade']);

    expect($overallGrade)->toBe($this->event['values']['grades']['overall_grade']['grade']);
    expect($overallGradeNickname)->toBe($this->event['values']['grades']['overall_grade']['nickname']);
});

it('should correctly set the cvat grades with delta', function () {
    $this->card->update(['grade_delta' => 0.5]);

    $signature = hash_hmac('sha256', json_encode($this->event, JSON_THROW_ON_ERROR), $this->secret);
    postJson('/webhooks/cvat-grades', $this->event, [
        'Signature' => $signature,
    ])->assertOk();

    $this->card->refresh();

    expect($this->card->overall_grade)->toBe(3.0);
    expect($this->card->overall_grade_nickname)->toBe('VG');
});

it('should fail if no signature', function () {
    postJson('/webhooks/cvat-grades', $this->event)->assertStatus(500);
});

it('should fail if wrong signature', function () {
    postJson('/webhooks/cvat-grades', $this->event, [
        'Signature' => 'wrong',
    ])->assertStatus(500);
});
