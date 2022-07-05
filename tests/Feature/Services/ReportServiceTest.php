<?php

use App\Jobs\Email\SendScheduledEmail;
use App\Mail\Admin\Report;
use App\Models\Order;
use App\Models\ScheduledEmail;
use App\Services\EmailService;
use App\Services\Report\ReportsService;
use Illuminate\Support\Facades\Bus;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;

it('runs send reports command', function () {
    $this->artisan('reports:send-email')
        ->assertExitCode(0);
});

it('schedules email', function () {
    $sendAt = now()->addDay();
    $data = [
        'recipients' => [['test@test.test' => 'Test Name']],
        'subject' => 'Test Subject',
        'templateName' => 'test_template',
        'templateContent' => [],
    ];

    resolve(EmailService::class)->scheduleEmail(
        $sendAt,
        $data['recipients'],
        $data['subject'],
        $data['templateName'],
        $data['templateContent']
    );

    assertDatabaseCount('scheduled_emails', 1);
    assertDatabaseHas('scheduled_emails', [
        'send_at' => $sendAt->toDateTimeString(),
        'payload' => serialize($data),
        'is_sent' => 0,
    ]);
});

it('processes scheduled emails', function () {
    Bus::fake();

    ScheduledEmail::factory()->create([
        'send_at' => now()->addMinutes(5),
        'is_sent' => 0,
    ]);

    resolve(EmailService::class)->processScheduledEmails();
    Bus::assertNotDispatched(SendScheduledEmail::class);

    $this->travel(6)->minutes();
    resolve(EmailService::class)->processScheduledEmails();
    Bus::assertDispatched(SendScheduledEmail::class);
});

it('schedules email which would be rescheduled', function () {
    $order = Order::factory()->create();

    $sendAt = now()->addDay();
    $data = [
        'recipients' => [['test@test.test' => 'Test Name']],
        'subject' => 'Test Subject',
        'templateName' => 'test_template',
        'templateContent' => [],
    ];

    resolve(EmailService::class)->scheduleEmail(
        $sendAt,
        $data['recipients'],
        $data['subject'],
        $data['templateName'],
        $data['templateContent'],
        true,
        'TestCheck',
        ['order_id' => $order->id]
    );

    assertDatabaseCount('scheduled_emails', 1);
    assertDatabaseHas('scheduled_emails', [
        'send_at' => $sendAt->toDateTimeString(),
        'payload' => serialize($data),
        'is_sent' => 0,
        'rescheduling_required' => 1,
        'check_class' => 'TestCheck',
        'extra_data' => serialize(['order_id' => $order->id]),
    ]);
});
