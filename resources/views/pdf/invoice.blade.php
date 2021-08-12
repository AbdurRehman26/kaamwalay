<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Submission Invoice</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <style>
        html{
            margin: 36px;
        }
        body{
            font-family: 'Roboto';
            font-size: 14px;
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
            font-family: 'DDT';
            font-size: 45px;
            font-weight: bold;
            line-height: 50px;
            margin: 0;
        }

        .general-info-section{
            margin-top: 33px;
            width: 100%;
        }
        .general-info-holder{
            /* float: left; */
            /* width: 50%; */
            width: 25%;
            vertical-align: top;
        }
        .customer-id-holder{
            /* float: left; */
            width: 50%;
            text-align: right;
            vertical-align: bottom;
        }
        .info-list-table, .info-list-table .dt, .info-list-table .dd{
            width: 50%;
            /* float: left; */
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
            /* float: right; */
            /* width: 50%; */

            width: 100%;
            margin: 2px 0;
            line-height: 18px;
        }

        .info-list-table .dt, .customer-info-list-table .dt{
            font-weight: 500;
        }
        .customer-info-list-table{
            /* clear:right; */
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
            font-family: 'DDT';
            font-size: 30px;
            font-weight: 700;
            line-height: 36px;
            letter-spacing: 0.2px;
            margin: 0;
        }

        .order-details-section{
            margin-top: 38px;
            width: 100%;
        }
        .order-details-section .info-box{
            width: 23.5%;
            float: left;
        }
        .info-box-header, .items-table .header-row td{
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
            margin-top: 90px;

            border-spacing: 0;
            width:100%;
        }
        .items-table .header-row td{
            padding: 8px 0;
            text-align: left;
        }
        .items-table .header-row td:first-child{
            padding-left: 8px;
        }
        .items-table .header-row td:last-child{
            padding-right: 8px;
            text-align: right;
        }
        .item-row .value{
            text-align: right;
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
        .info-box-content table{
            width: 100%;
        }
        .info-line{
            /* display: flex;
            flex-direction: row; */
        }
        .info-line .info-title{
            width: 83.5%;
        }


        footer {
            position: fixed; 
            bottom: 80px; 
            left: 0px; 
            right: 0px;
            text-align: start;

        }
    </style>
</head>
<body>
    <div class="heading">
        <div class="logo">
            <img src="{{$logoData}}"/>

        </div>
        <div class="barcode">
            <div class="barcode-container">
                <img src="data:image/png;base64, {!! DNS1D::getBarcodePNG('RG290183', 'C128') !!}" />
                <br/>
                <span>RG290183</span>
            </div>
        </div>
    </div>
    <div class="general-info-section">
        <table style="width: 100%;">
            <tbody>
                <tr>
                    <td class="general-info-holder">
                        <table class="info-list-table">
                            <tbody>
                                <tr>
                                    <td class="dt">Submission #:</td>
                                    <td class="dd">RG290183</td>
                                </tr>
                                <tr>
                                    <td class="dt">Service level:</td>
                                    <td class="dd">$20 / Card</td>
                                </tr>
                                <tr>
                                    <td class="dt">No. of Cards: </td>
                                    <td class="dd">1</td>
                                </tr>
                                <tr>
                                    <td class="dt">Shipping Method:</td>
                                    <td class="dd">Insured</td>
                                </tr>
                                <tr>
                                    <td class="dt">Date:</td>
                                    <td class="dd">8/24/2021</td>
                                </tr>
                                <tr>
                                    <td class="dt">Declared Value:</td>
                                    <td class="dd">$400.00</td>
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
                                        James Smith
                                        jsmith@email.com
                                        (718) 999-1910
                                        Customer ID: C925486
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td class="customer-id-holder">
                        Customer ID:
                        <p class="customer-id">
                            C925486
                        </p> 
                    </td>
                </tr>
            </tbody>
        </table>
        {{-- <div class="general-info-holder">
            <table class="info-list-table">
                <tbody>
                    <tr>
                        <td class="dt">Submission #:</td>
                        <td class="dd">RG290183</td>
                    </tr>
                    <tr>
                        <td class="dt">Service level:</td>
                        <td class="dd">$20 / Card</td>
                    </tr>
                    <tr>
                        <td class="dt">No. of Cards: </td>
                        <td class="dd">1</td>
                    </tr>
                    <tr>
                        <td class="dt">Shipping Method:</td>
                        <td class="dd">Insured</td>
                    </tr>
                    <tr>
                        <td class="dt">Date:</td>
                        <td class="dd">8/24/2021</td>
                    </tr>
                    <tr>
                        <td class="dt">Declared Value:</td>
                        <td class="dd">$400.00</td>
                    </tr>
                </tbody>
            </table>
            <table class="customer-info-list-table">
                <tbody>
                    <tr>
                        <td class="dt">Customer:</td>
                        <td class="dd">
                            James Smith
                            jsmith@email.com
                            (718) 999-1910
                            Customer ID: C925486
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="customer-id-holder">
                Customer ID:
                <p class="customer-id">
                    C925486
                </p>
        </div> --}}
    </div>
    <div class="order-details-section">
        <div class="info-box pr-20">
            <div class="info-box-header">
                Shipping Address
            </div>
            <div class="info-box-content">
                James Smith
                <br/>
                727 Amsterdam Blvd.
                <br/>
                New York, NY 10301, US
                <br/>
                (718) 999-1910
            </div>
        </div>
        <div class="info-box pr-20">
            <div class="info-box-header">
                Payment Method
            </div>
            <div class="info-box-content">
                Visa ending in 7972
                <br/>
                Exp. 08/24
            </div>
        </div>
        <div class="info-box pr-20">
            <div class="info-box-header">
                Billing Address
            </div>
            <div class="info-box-content">
                Same as shipping
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
                                $20.00
                            </td>
                        </tr>
                        <tr class="info-line">
                            <td class="info-title">
                                Insured Shipping:
                            </td>
                            <td class="info-content">
                                $14.00
                            </td>
                        </tr>
                        <tr class="info-line">
                            <td class="info-title">
                                Total:
                            </td>
                            <td class="info-content">
                                $34.00
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
                    <td>Card No.</td>
                    <td>Description</td>
                    <td>Qty</td>
                    <td>Declared Value (USD)</td>
                </tr>
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
        {{-- <table>
            <tbody>
                <tr>
                    <td>
                        asd
                    </td>
                    <td>lkasf</td>
                </tr>
            </tbody>
        </table> --}}
    </div>
    <div class="total-declared-section">
        Total Declared Value: <b>$400.00</b>
    </div>
    <footer>
        <img src="{{$agsLogo}}"/>
        <br/>
        727 Page Ave
        <br/>
        Staten Island, NY 10309, US
        <br/>
        (718) 999-1910
    </footer>
</body>
</html>