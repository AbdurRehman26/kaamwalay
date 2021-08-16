<?php

namespace App\Services\Payment;

use App\Exceptions\Services\Payment\InvoiceNotUploaded;
use App\Models\Invoice;
use App\Models\Order;
use App\Services\BarcodeService;
use App\Services\PDFService;
use Carbon\Carbon;
use CodeItNow\BarcodeBundle\Utils\BarcodeGenerator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InvoiceService
{
    /**
     * @throws InvoiceNotUploaded
     */
    public function saveInvoicePDF(Order $order): void
    {
        $data = $this->getInvoiceData($order);
        $pdf = PDFService::generate('pdf.invoice', $data);

        $url = $this->uploadToCloud($pdf->output());

        $this->createAndStoreInvoiceRecord($order, $url);
    }

    protected function getInvoiceData(Order $order): array
    {
        $logoData = 'data:image/png;base64,' . base64_encode(file_get_contents(resource_path('assets/logos/invoiceLogo.png')));
        $agsLogo = 'data:image/png;base64,' . base64_encode(file_get_contents(resource_path('assets/logos/agsLogo.png')));
        $barcode = 'data:image/png;base64,' . BarcodeService::generate($order->order_number, BarcodeGenerator::Code39, '', 2);

        $orderPayment = $order->orderPayment;
        $paymentResponse = $orderPayment ? json_decode($orderPayment->response) : null;
        if ($paymentResponse) {
            if ($order->paymentMethod->code === 'paypal') {
                $orderPayment = json_decode(json_encode($this->paypalData(json_decode($orderPayment->response, associative: true) ?? [])));
            } else {
                if (property_exists($paymentResponse, 'card')) {
                    $card = $paymentResponse->card;
                } else {
                    $card = $paymentResponse->charges->data[0]->payment_method_details->card;
                }
                $orderPayment = json_decode(json_encode([
                    'card' => [
                        'brand' => $card->brand,
                        'exp_month' => Str::padLeft($card->exp_month, 2, '0'),
                        'exp_year' => substr($card->exp_year, 2),
                        'last4' => $card->last4,
                    ],
                ]));
            }
        }

        return [
            'logoData' => $logoData,
            'agsLogo' => $agsLogo,
            'barcode' => $barcode,
            'order' => $order,
            'orderDate' => Carbon::parse($order->created_at)->format('m/d/Y'),
            'orderItems' => $order->orderItems,
            'customer' => $order->user,
            'shippingAddress' => $order->shippingAddress,
            'orderPayment' => $orderPayment,
            'billingAddress' => $order->billingAddress,
        ];
    }

    protected function createAndStoreInvoiceRecord(Order $order, string $url)
    {
        $invoice = new Invoice();
        $invoice->invoice_number = $order->order_number;
        $invoice->path = $url;
        $invoice->save();

        $order->invoice_id = $invoice->id;
        $order->save();
    }

    protected function paypalData(array $response): array
    {
        return [
            'payer' => [
                "email" => $response['payer']['email_address'] ?? "N/A",
                "name" => $response['payer']['name']['given_name'] ?? "N/A",
            ],
        ];
    }

    /**
     * @throws InvoiceNotUploaded
     */
    protected function uploadToCloud(string $pdfData): string
    {
        $filePath = 'invoice/' . Str::uuid() . '.pdf';

        if (Storage::disk('s3')->put($filePath, $pdfData)) {
            return Storage::disk('s3')->url($filePath);
        }

        throw new InvoiceNotUploaded;
    }
}