<?php

namespace App\Services\Payment\V2;

use App\Exceptions\Services\Payment\InvoiceNotUploaded;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Services\BarcodeService;
use App\Services\PDFService;
use Carbon\Carbon;
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
        $barcode = 'data:image/png;base64,' . BarcodeService::generate($order->order_number);

        $orderPayment = $order->firstOrderPayment;
        $paymentResponse = $orderPayment ? json_decode($orderPayment->response) : null;
        if ($paymentResponse && ! $order->paymentMethod->isWallet()) {
            $orderPayment = match (true) {
                $order->paymentMethod->isPaypal() => $this->getPaypalPaymentResponse($orderPayment),
                $order->paymentMethod->isCollectorCoin() => $this->getCollectorCoinPaymentResponse(
                    $paymentResponse,
                    $orderPayment
                ),
                $order->paymentMethod->isManual() => $this->getManualPaymentResponse(),
                default => $this->getStripePaymentResponse($paymentResponse),
            };
        }

        return [
            'logoData' => $logoData,
            'agsLogo' => $agsLogo,
            'barcode' => $barcode,
            'order' => $order,
            'orderDate' => Carbon::parse($order->created_at)->format('m/d/Y'),
            'orderItems' => $order->getGroupedOrderItems(),
            'customer' => $order->user,
            'shippingAddress' => $order->shippingAddress,
            'orderPayment' => $orderPayment,
            'billingAddress' => $order->billingAddress,
        ];
    }

    protected function createAndStoreInvoiceRecord(Order $order, string $url): void
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

    protected function getPaypalPaymentResponse(OrderPayment $orderPayment): object
    {
        return json_decode(
            json_encode(
                $this->paypalData(
                    json_decode($orderPayment->response, associative: true) ?? []
                )
            )
        );
    }

    protected function getStripePaymentResponse(object $paymentResponse): object
    {
        if (property_exists($paymentResponse, 'card')) {
            $card = $paymentResponse->card;
        } else {
            $card = $paymentResponse->latest_charge->payment_method_details->card;
        }

        return json_decode(json_encode([
            'card' => [
                'brand' => $card->brand,
                'exp_month' => Str::padLeft($card->exp_month, 2, '0'),
                'exp_year' => substr($card->exp_year, 2),
                'last4' => $card->last4,
            ],
        ]));
    }

    protected function getCollectorCoinPaymentResponse(object $paymentResponse, OrderPayment $orderPayment): object
    {
        return json_decode(json_encode([
            'transaction' => [
                'amount' => $paymentResponse->amount,
                'hash' => substr($orderPayment->payment_provider_reference_id, 0, 5) . '...' . substr($orderPayment->payment_provider_reference_id, -4),
            ],
        ]));
    }

    protected function getManualPaymentResponse(): object
    {
        return json_decode(json_encode([
            'manual' => true,
        ]));
    }
}
