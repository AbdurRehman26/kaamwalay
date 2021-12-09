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
    $res = postJson('/api/webhooks/cvat-grades', $this->event, [
        'Signature' => $signature,
    ]);

    $res->assertOk();
    $this->card->refresh();

    $humanGradeValues = $this->card->human_grade_values;
    $overallGrade = $this->card->overall_grade;
    $overallGradeNickname = $this->card->overall_grade_nickname;

    $this->assertEquals($humanGradeValues['back']['center'], $this->event['values']['grades']['back_centering_human_grade']);
    $this->assertEquals($humanGradeValues['back']['edge'], $this->event['values']['grades']['back_edges_human_grade']);
    $this->assertEquals($humanGradeValues['back']['corner'], $this->event['values']['grades']['back_corners_human_grade']);
    $this->assertEquals($humanGradeValues['back']['surface'], $this->event['values']['grades']['back_surface_human_grade']);

    $this->assertEquals($humanGradeValues['front']['center'],
        $this->event['values']['grades']['front_centering_human_grade']);
    $this->assertEquals($humanGradeValues['front']['edge'], $this->event['values']['grades']['front_edges_human_grade']);
    $this->assertEquals($humanGradeValues['front']['corner'], $this->event['values']['grades']['front_corners_human_grade']);
    $this->assertEquals($humanGradeValues['front']['surface'], $this->event['values']['grades']['front_surface_human_grade']);

    $this->assertEquals($overallGrade, $this->event['values']['grades']['overall_grade']['grade']);
    $this->assertEquals($overallGradeNickname, $this->event['values']['grades']['overall_grade']['nickname']);
});

it('should correctly set the cvat grades with delta', function () {
    $this->card->update(['grade_delta' => 0.5]);

    $signature = hash_hmac('sha256', json_encode($this->event, JSON_THROW_ON_ERROR), $this->secret);
    $res = postJson('/api/webhooks/cvat-grades', $this->event, [
        'Signature' => $signature,
    ]);

    $res->assertOk();
    $this->card->refresh();

    $this->assertEquals($this->card->overall_grade, 3.0);
    $this->assertEquals($this->card->overall_grade_nickname, 'VG');
});

it('should fail if no signature', function () {
    $res = postJson('/api/webhooks/cvat-grades', $this->event);

    $res->assertStatus(500);
});

it('should fail if wrong signature', function () {
    $res = postJson('/api/webhooks/cvat-grades', $this->event, [
        'Signature' => 'wrong',
    ]);

    $res->assertStatus(500);
});
