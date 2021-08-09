<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Submission Invoice</title>
    <style>
        body{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 14px;
            padding: 36px;
        }
        .heading,.general-info-section,.order-details-seciton,.order-items-section, .total-declared-section{
            width: 100%;
            display: inline-flex;
            flex-direction: row;
        }
        .heading{
            margin-bottom: 33px;
        }
        .general-info-section{
            margin-bottom: 38px;
        }
        .logo, .barcode, .general-info-holder, .customer-id-holder{
            width:50%;
        }
        .general-info-holder{
            display: inline-flex;
        }
        .barcode {
            justify-content: end;
            text-align: end;
        }
        .customer-id-holder{
            display: flex;
            flex-direction: column;

            align-items: flex-end;
            justify-content: flex-end;
        }
        .order-details-seciton{
            margin-bottom: 90px;
        }
        .order-details-seciton .info-box{
            width:25%;
        }
        .info-box-header, .items-table thead th{
            background-color: black;
            color: white;
            font-weight: 500;
        }
        .info-box-header{
            padding: 8px;
        }
        .items-table thead th{
            padding: 8px 0;
            text-align: start;
        }
        .items-table thead th:first-child{
            padding-left: 8px;
        }
        .items-table thead th:last-child{
            padding-right: 8px;
            text-align: end;
        }
        .item-row .value{
            text-align: end;
        }
        .info-box-content{
            padding: 8px;
            line-height: 24px;
        }
        .total-declared-section{
            padding: 25px 0px;
            justify-content: flex-end;
            border-bottom: 1px solid rgba(30, 30, 30, 0.2);;
        }
        .total-declared-section b{
            margin-left: 5px;
        }
        .info-list, .customer-info-list{
            display: flex;
            flex-wrap: wrap;
        }
        .info-list, .info-list dt, .info-list dd, .customer-info-list{
            width:50%;
            margin: 2px 0;
            line-height: 24px;
        }
        .info-list dt{
            font-weight: 500;
        }
        .customer-info-list dt{
            margin: 0;
            width: 33%;
            font-weight: 500;
        }
        .customer-info-list dd{
            margin: 0;
            width: 66%;
        }
        .customer-id{
            font-family: 'DDT';
            font-size: 30px;
            font-weight: 700;
            line-height: 42px;
            letter-spacing: 0.2px;
            margin: 0;
        }
        .items-table{
            border-spacing: 0;
            width:100%;
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
            line-height: 20px;
        }
        .items-table .item-row td.description .item-name{
            font-weight: 500;
        }
        .pr-20{
            padding-right: 20px;
        }
        .pl-20{
            padding-left: 20px;
        }
        .info-line{
            display: flex;
            flex-direction: row;
        }
        .info-line .info-title{
            width: 83.5%;
        }
    </style>
</head>
<body>
    <div class="heading">
        <div class="logo">
            Logo
        </div>
        <div class="barcode">
            Barcode
        </div>
    </div>
    <div class="general-info-section">
        <div class="general-info-holder">
            <dl class="info-list">
                <dt>Submission #:</dt>
                <dd>RG290183</dd>
                <dt>Service level:</dt>
                <dd>$20 / Card</dd>
                <dt>No. of Cards: </dt>
                <dd>1</dd>
                <dt>Shipping Method:</dt>
                <dd>Insured</dd>
                <dt>Date:</dt>
                <dd>8/24/2021</dd>
                <dt>Declared Value:</dt>
                <dd>$400.00</dd>
            </dl>
            <dl class="customer-info-list">
                <dt>Customer:</dt>
                <dd>
                    James Smith
                    jsmith@email.com
                    (718) 999-1910
                    Customer ID: C925486
                </dd>
            </dl>
        </div>
        <div class="customer-id-holder">
            Customer ID:
            <p class="customer-id">
                C925486
            </p>
        </div>
    </div>
    <div class="order-details-seciton">
        <div class="info-box pr-20">
            <div class="info-box-header">
                Shipping Address
            </div>
            <div class="info-box-content">
                James Smith
                727 Amsterdam Blvd.
                New York, NY 10301, US
                (718) 999-1910
            </div>
        </div>
        <div class="info-box pr-20 pl-20">
            <div class="info-box-header">
                Payment Method
            </div>
            <div class="info-box-content">
                Visa ending in 7972
                Exp. 08/24
            </div>
        </div>
        <div class="info-box pr-20 pl-20">
            <div class="info-box-header">
                Billing Address
            </div>
            <div class="info-box-content">
                Same as shipping
            </div>
        </div>
        <div class="info-box pl-20">
            <div class="info-box-header">
                Price Summary
            </div>
            <div class="info-box-content">
                <div class="info-line">
                    <div class="info-title">
                        Service Fee:
                    </div>
                    <div class="info-content">
                        $20.00
                    </div>
                </div>
                <div class="info-line">
                    <div class="info-title">
                        Insured Shipping:
                    </div>
                    <div class="info-content">
                        $14.00
                    </div>
                </div>
                <div class="info-line">
                    <div class="info-title">
                        Total:
                    </div>
                    <div class="info-content">
                        $34.00
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="order-items-section">
        <table class="items-table">
            <thead>
                <th>Card No.</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Declared Value (USD)</th>
            </thead>
            <tbody>
                <tr class="item-row">
                    <td class="card-no">
                        89897080
                    </td>
                    <td class="description">
                        <div class="item-name">
                            Charizard
                        </div>
                        <div class="item-desc">
                            2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard
                        </div>
                    </td>
                    <td class="qty">
                        1
                    </td>
                    <td class="value">
                        $400.00
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="total-declared-section">
        Total Declared Value: <b>$400.00</b>
    </div>
</body>
</html>