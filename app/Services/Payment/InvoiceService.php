<?php

namespace App\Services\Payment;

use App\Models\Invoice;
use App\Models\Order;
use App\Services\BarcodeService;
use App\Services\PDFService;
use CodeItNow\BarcodeBundle\Utils\BarcodeGenerator;
use Storage;
use Str;

class InvoiceService
{
    public function saveInvoicePDF(Order $order)
    {
        $data = $this->getInvoiceData($order);

        $fileName = Str::uuid();
        $pdf = PDFService::generate('pdf.invoice', $data);
        Storage::disk('s3')
            ->put(
                'invoice/invoice-' . $fileName . '.pdf',
                $pdf->output()
            );
        $url = Storage::disk('s3')->url('invoice/invoice-' . $fileName . '.pdf');

        $this->createAndStoreInvoiceRecord($order, $url);
    }

    protected function getInvoiceData(Order $order)
    {
        $logoData = 'data:image/png;base64,' . base64_encode(file_get_contents(resource_path('assets/logos/invoiceLogo.png')));
        $agsLogo = 'data:image/png;base64,' . base64_encode(file_get_contents(resource_path('assets/logos/agsLogo.png')));
        $barcode = 'data:image/png;base64,' . BarcodeService::generate($order->order_number, BarcodeGenerator::Code39, '');

        $orderItems = $order->orderItems;
        $customer = $order->user;
        $shippingAddress = $order->shippingAddress;
        $billingAddress = $order->billingAddress;
        $orderPayment = $order->orderPayment;
        $paymentResponse = $orderPayment ? json_decode($orderPayment->response) : null;
        if ($paymentResponse) {
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

        return [
            'logoData' => $logoData,
            'agsLogo' => $agsLogo,
            'barcode' => $barcode,
            'order' => $order,
            'orderItems' => $orderItems,
            'customer' => $customer,
            'shippingAddress' => $shippingAddress,
            'orderPayment' => $orderPayment,
            'billingAddress' => $billingAddress,
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
}
