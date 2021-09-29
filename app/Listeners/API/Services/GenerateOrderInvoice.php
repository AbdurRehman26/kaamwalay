<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\EmailService;
use App\Services\Payment\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class GenerateOrderInvoice implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 5;

    public function __construct(public InvoiceService $invoiceService, public EmailService $emailService)
    {
        //
    }

    public function handle(OrderPaid $event): void
    {
        $this->invoiceService->saveInvoicePDF($event->order);

        $template = EmailService::TEMPLATE_SLUG_CUSTOMER_SHIPMENT_TRACKING_REMINDER;

        (new EmailService)->scheduleEmail((now()->addDay()), $event->order->user->email, $event->order->user->getFullName(), $this->emailService->getSubjectByTemplate($template), $template, ['FIRST_NAME' => $event->order->user->first_name]);
    }

    public function failed(OrderPaid $event, $exception)
    {
        Log::error($exception->getMessage(), [
            'Invoice generation failed. Order ID: ' => $event->order->id,
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
