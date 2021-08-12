<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Submission Invoice</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <style>
        @page {
            margin: 4.3cm 0.9525cm 3cm 0.9525cm;
        }

        header {
            position: fixed;
            top: -113px;
            left: 0px;
            right: 0px;
        }
        footer {
            position: fixed;
            bottom: 0px;
            left: 0px;
            right: 0px;
            text-align: start;
        }

        body{
            font-family: 'Roboto';
            font-size: 13px;
            margin: 0;
        }
        .heading,.general-info-section,.order-details-section,.order-items-section, .total-declared-section{
            width: 100%;
            display: inline-block;
            clear: both;
        }
        .logo, .barcode, .customer-id-holder{
            width:50%;
        }
        .logo{
            float: left;
        }
        .logo img{
            width: 400px;
            height: 96px;
        }
        .barcode{
            float: right;
            text-align: right;
        }
        .barcode-container{
            float:right;
            clear: right;
            text-align: center;

        }
        .barcode img{
            width: 241px;
            height: 45px;
        }
        .barcode span{
            font-family: 'Roboto';
            font-size: 30px;
            font-weight: bold;
            margin: 0;
            line-height: 20px;
        }

        .general-info-section{
            width: 100%;
        }
        .general-info-holder{
            width: 40%;
            vertical-align: top;
        }
        .customer-id-holder{
            width: 20%;
            text-align: right;
            vertical-align: bottom;
        }
        .info-list-table, .info-list-table .dt, .info-list-table .dd{
            width: 50%;
            margin: 2px 0;
            line-height: 18px;
        }
        .info-list-table td, .customer-info-list-table td{
            vertical-align: top;
        }
        .info-list-table{
            width: 100%;
        }
        .customer-info-list-table{
            width: 100%;
            margin: 2px 0;
            line-height: 18px;
        }

        .info-list-table .dt, .customer-info-list-table .dt{
            font-weight: 500;
        }
        .customer-info-list-table .dt{
            margin: 0;
            width: 33%;
        }
        .customer-info-list-table .dd{
            margin: 0;
            width: 66%;
        }
        .customer-id{
            font-family: 'Roboto';
            font-size: 30px;
            font-weight: 700;
            line-height: 30px;
            letter-spacing: 0.2px;
            margin: 0;
        }

        .order-details-section{
            margin-top: 38px;
            width: 100%;
        }
        .order-details-section .info-box{
            width: 24%;
            float: left;
        }
        .info-box-header, .items-table .header-row th{
            background-color: black;
            color: white;
            font-weight: 500;
        }
        .info-box-header{
            padding: 8px;
        }

        .info-box-content{
            padding: 8px;
            line-height: 18px;
        }
        .total-declared-section{
            text-align: right;
            padding: 25px 0px;
            border-bottom: 1px solid rgba(30, 30, 30, 0.2);;
        }
        .total-declared-section b{
            margin-left: 5px;
        }
        .items-table{
            margin-top: 50px;

            border-spacing: 0;
            width:100%;
        }
        .items-table .header-row th{
            padding: 8px 0;
            text-align: left;
        }
        .items-table .header-row th:first-child{
            padding-left: 8px;
        }
        .items-table .header-row th:last-child{
            padding-right: 8px;
            text-align: right;
        }
        .item-row .value{
            text-align: right;
        }

        .items-table{
            page-break-inside: always;
        }
        .items-table .item-row td{
            padding: 25px 0;
            vertical-align: top;
            border-bottom: 1px solid rgba(30, 30, 30, 0.2);;
        }
        .items-table .item-row td.card-no{
            padding-left: 8px;
        }

        .items-table .item-row td.value{
            padding-right: 8px;
        }
        .items-table .item-row td.description{
            line-height: 16px;
        }
        .items-table .item-row td.description .item-name{
            line-height: 14px;
            font-weight: 500;
        }
        .pr-10{
            padding-right: 10px;
        }
        .info-box-content table{
            width: 100%;
        }
        .info-line .info-title{
            width: 83.5%;
        }

    </style>
</head>
<body>
    <header class="heading">
        <div class="logo">
            <img src="{{$logoData}}"/>

        </div>
        <div class="barcode">
            <div class="barcode-container">
                <img src="data:image/png;base64, {!! DNS1D::getBarcodePNG('{{$order->order_number}}', 'C128') !!}" />
                <br/>
                <span>{{$order->order_number}}</span>
            </div>
        </div>
    </header>
    <footer>
        <img src="{{$agsLogo}}"/>
        <br/>
        727 Page Ave
        <br/>
        Staten Island, NY 10309, US
        <br/>
        (718) 999-1910
    </footer>
    <main>
        <div class="general-info-section">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td class="general-info-holder">
                            <table class="info-list-table">
                                <tbody>
                                    <tr>
                                        <td class="dt">Submission #:</td>
                                        <td class="dd">{{$order->order_number}}</td>
                                    </tr>
                                    <tr>
                                        <td class="dt">Service level:</td>
                                        <td class="dd">${{$order->paymentPlan->price}} / Card</td>
                                    </tr>
                                    <tr>
                                        <td class="dt">No. of Cards: </td>
                                        <td class="dd">{{$orderItems->sum('quantity')}}</td>
                                    </tr>
                                    <tr>
                                        <td class="dt">Shipping Method:</td>
                                        <td class="dd">{{$order->shippingMethod->name}}</td>
                                    </tr>
                                    <tr>
                                        <td class="dt">Date:</td>
                                        <td class="dd">{{$order->date}}</td>
                                    </tr>
                                    <tr>
                                        <td class="dt">Declared Value:</td>
                                        <td class="dd">${{number_format($orderItems->sum('declared_value_total'),2)}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td class="general-info-holder" >
                            <table class="customer-info-list-table">
                                <tbody>
                                    <tr>
                                        <td class="dt">Customer:</td>
                                        <td class="dd">
                                            {{$customer->full_name}}
                                            <br/>
                                            {{$customer->email}}
                                            @if($customer->phone)
                                            <br/>
                                            {{$customer->phone}}
                                            @endif
                                            <br/>
                                            Customer ID: {{$customer->id}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td class="customer-id-holder">
                            Customer ID:
                            <p class="customer-id">
                                {{$customer->id}}
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="order-details-section">
            <div class="info-box pr-10">
                <div class="info-box-header">
                    Shipping Address
                </div>
                <div class="info-box-content">
                    {{$shippingAddress->full_name}}
                    <br/>
                    {{$shippingAddress->address}}
                    <br/>
                    {{$shippingAddress->city}}, {{$shippingAddress->state}} {{$shippingAddress->zip}}, {{$shippingAddress->country->code}}
                    <br/>
                    {{$shippingAddress->phone}}
                </div>
            </div>
            <div class="info-box pr-10">
                <div class="info-box-header">
                    Payment Method
                </div>
                <div class="info-box-content">
                    @if($orderPayment)
                        @if($orderPayment->card)
                            {{ucfirst($orderPayment->card->brand)}} ending in {{$orderPayment->card->last4}}
                            <br/>
                            Exp. {{$orderPayment->card->exp_month}}/{{$orderPayment->card->exp_year}}
                        @endif
                    @else
                        No payment found
                    @endif
                </div>
            </div>
            <div class="info-box pr-10">
                <div class="info-box-header">
                    Billing Address
                </div>
                <div class="info-box-content">
                    @if($shippingAddress->id === $billingAddress->id)
                        Same as shipping
                    @else
                        {{$billingAddress->full_name}}
                        <br/>
                        {{$billingAddress->address}}
                        <br/>
                        {{$billingAddress->city}}, {{$billingAddress->state}} {{$billingAddress->zip}}, {{$billingAddress->country->code}}
                        <br/>
                        {{$billingAddress->phone}}
                    @endif
                </div>
            </div>
            <div class="info-box">
                <div class="info-box-header">
                    Price Summary
                </div>
                <div class="info-box-content">
                    <table>
                        <tbody>
                            <tr class="info-line">
                                <td class="info-title">
                                    Service Fee:
                                </td>
                                <td class="info-content">
                                    ${{number_format($order->service_fee,2)}}
                                </td>
                            </tr>
                            <tr class="info-line">
                                <td class="info-title">
                                    Insured Shipping:
                                </td>
                                <td class="info-content">
                                    ${{number_format($order->shipping_fee,2)}}
                                </td>
                            </tr>
                            <tr class="info-line">
                                <td class="info-title">
                                    Total:
                                </td>
                                <td class="info-content">
                                    ${{number_format($order->grand_total,2)}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="order-items-section">
            <table class="items-table">
                <tbody>
                    <tr class="header-row">
                        <th>Card No.</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Declared Value (USD)</th>
                    </tr>
                    @foreach ($orderItems as $item)
                        <tr class="item-row">
                            <td class="card-no">
                                {{$item->id}}
                            </td>
                            <td class="description">
                                <div class="item-name">
                                    {{$item->cardProduct->name}}
                                </div>
                                <div class="item-desc">
                                    {{$item->cardProduct->identifier_string}}
                                </div>
                            </td>
                            <td class="qty">
                                {{$item->quantity}}
                            </td>
                            <td class="value">
                                ${{number_format($item->declared_value_per_unit,2)}}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        <div class="total-declared-section">
            Total Declared Value: <b>${{number_format($orderItems->sum('declared_value_total'),2)}}</b>
        </div>
    </main>
</body>
</html>