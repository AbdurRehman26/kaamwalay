<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Services\PDFService;

class InvoiceService
{
    protected function getInvoiceData(Order $order)
    {
        $logoContent = file_get_contents(resource_path('assets/logos/invoiceLogo.png'));
        $logoData = 'data:image/png;base64,'.base64_encode($logoContent);

        $agsLogoContent = file_get_contents(resource_path('assets/logos/agsLogo.png'));
        $agsLogo = 'data:image/png;base64,'.base64_encode($agsLogoContent);

        $orderItems = $order->orderItems;
        $customer = $order->user;
        $shippingAddress = $order->shippingAddress;
        $billingAddress = $order->billingAddress;
        $orderPayment = $order->orderPayment;
        $paymentResponse = $orderPayment ? json_decode($orderPayment->response) : null;
        if ($paymentResponse) {
            $orderPayment = json_decode(json_encode([
                'card' => [
                    'brand' => $paymentResponse->card->brand,
                    'exp_month' => \Str::padLeft($paymentResponse->card->exp_month, 2, '0'),
                    'exp_year' => substr($paymentResponse->card->exp_year, 2),
                    'last4' => $paymentResponse->card->last4,
                ],
            ]));
        }

        return [
            'logoData' => $logoData,
            'agsLogo' => $agsLogo,
            'order' => $order,
            'orderItems' => $orderItems,
            'customer' => $customer,
            'shippingAddress' => $shippingAddress,
            'orderPayment' => $orderPayment,
            'billingAddress' => $billingAddress,
        ];
    }
    protected function saveInvoicePDF(Order $order)
    {
        $data = $this->getInvoiceData($order);

        $pdf = PDFService::generate('pdf.invoice', $data);
        \Storage::disk('s3')
            ->put(
                'invoice/invoice-'.$order->order_number.'.pdf',
                $pdf->output()
            );
        $url = \Storage::disk('s3')->url('invoice/invoice-'.$order->order_number.'.pdf');

        $this->createAndStoreInvoiceRecord($order, $url);
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
