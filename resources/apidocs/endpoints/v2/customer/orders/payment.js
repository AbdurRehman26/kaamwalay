/**
 * @api {post} /v2/customer/orders/{order}/payments Order Payment
 * @apiName Order Payment
 * @apiGroup Customer-Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "payment_method": {
 *              "id": 1
 *          },
 *          "coupon": {
 *              "code": "HvTGSYpak9",
 *              "id": 2
 *          },
 *          "payment_by_wallet": 10.00,
 *      }
 *
 * @apiSuccess {Object} data Payment Object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
            "success": true,
            "data": {
                "id": "pi_3JNgAkJCai8r8pbf1S2xR7CQ",
                "object": "payment_intent",
                "amount": 996302,
                "amount_capturable": 0,
                "amount_received": 996302,
                "application": null,
                "application_fee_amount": null,
                "canceled_at": null,
                "cancellation_reason": null,
                "capture_method": "automatic",
                "charges": {
                    "object": "list",
                    "data": [
                        {
                            "id": "ch_3JNgAkJCai8r8pbf1DOSKhTN",
                            "object": "charge",
                            "amount": 996302,
                            "amount_captured": 996302,
                            "amount_refunded": 0,
                            "application": null,
                            "application_fee": null,
                            "application_fee_amount": null,
                            "balance_transaction": "txn_3JNgAkJCai8r8pbf1HPYRtkz",
                            "billing_details": {
                                "address": {
                                    "city": null,
                                    "country": null,
                                    "line1": null,
                                    "line2": null,
                                    "postal_code": "42424",
                                    "state": null
                                },
                                "email": null,
                                "name": null,
                                "phone": null
                            },
                            "calculated_statement_descriptor": "EMANUEL CEPOI PFA",
                            "captured": true,
                            "created": 1628783422,
                            "currency": "usd",
                            "customer": "cus_K1Sq1o4TaJvMHX",
                            "description": "Payment for Order # RG000000001",
                            "destination": null,
                            "dispute": null,
                            "disputed": false,
                            "failure_code": null,
                            "failure_message": null,
                            "fraud_details": [],
                            "invoice": null,
                            "livemode": false,
                            "metadata": {
                                "Order ID": "1",
                                "User Email": "bernardo.turcotte@example.org"
                            },
                            "on_behalf_of": null,
                            "order": null,
                            "outcome": {
                                "network_status": "approved_by_network",
                                "reason": null,
                                "risk_level": "normal",
                                "risk_score": 62,
                                "seller_message": "Payment complete.",
                                "type": "authorized"
                            },
                            "paid": true,
                            "payment_intent": "pi_3JNgAkJCai8r8pbf1S2xR7CQ",
                            "payment_method": "pm_1JNQ1VJCai8r8pbffJQmzj7g",
                            "payment_method_details": {
                                "card": {
                                    "brand": "visa",
                                    "checks": {
                                        "address_line1_check": null,
                                        "address_postal_code_check": "pass",
                                        "cvc_check": null
                                    },
                                    "country": "US",
                                    "exp_month": 4,
                                    "exp_year": 2024,
                                    "fingerprint": "0URonC78k7iDo17N",
                                    "funding": "credit",
                                    "installments": null,
                                    "last4": "4242",
                                    "network": "visa",
                                    "three_d_secure": null,
                                    "wallet": null
                                },
                                "type": "card"
                            },
                            "receipt_email": null,
                            "receipt_number": null,
                            "receipt_url": "https://pay.stripe.com/receipts/acct_1IyisDJCai8r8pbf/ch_3JNgAkJCai8r8pbf1DOSKhTN/rcpt_K1jelrmHPcqLxKbZEy43v5S5QUqFp5M",
                            "refunded": false,
                            "refunds": {
                                "object": "list",
                                "data": [],
                                "has_more": false,
                                "total_count": 0,
                                "url": "/v2/charges/ch_3JNgAkJCai8r8pbf1DOSKhTN/refunds"
                            },
                            "review": null,
                            "shipping": null,
                            "source": null,
                            "source_transfer": null,
                            "statement_descriptor": null,
                            "statement_descriptor_suffix": null,
                            "status": "succeeded",
                            "transfer_data": null,
                            "transfer_group": null
                        }
                    ],
                    "has_more": false,
                    "total_count": 1,
                    "url": "/v2/charges?payment_intent=pi_3JNgAkJCai8r8pbf1S2xR7CQ"
                },
                "client_secret": "pi_3JNgAkJCai8r8pbf1S2xR7CQ_secret_j9QzO4HsfUU7LBoxL6zGg0wpt",
                "confirmation_method": "automatic",
                "created": 1628783422,
                "currency": "usd",
                "customer": "cus_K1Sq1o4TaJvMHX",
                "description": "Payment for Order # RG000000001",
                "invoice": null,
                "last_payment_error": null,
                "livemode": false,
                "metadata": {
                    "Order ID": "1",
                    "User Email": "bernardo.turcotte@example.org"
                },
                "next_action": null,
                "on_behalf_of": null,
                "payment_method": "pm_1JNQ1VJCai8r8pbffJQmzj7g",
                "payment_method_options": {
                    "card": {
                        "installments": null,
                        "network": null,
                        "request_three_d_secure": "automatic"
                    }
                },
                "payment_method_types": [
                    "card"
                ],
                "receipt_email": null,
                "review": null,
                "setup_future_usage": null,
                "shipping": null,
                "source": null,
                "statement_descriptor": null,
                "statement_descriptor_suffix": null,
                "status": "succeeded",
                "transfer_data": null,
                "transfer_group": null
            }
        }
 */
