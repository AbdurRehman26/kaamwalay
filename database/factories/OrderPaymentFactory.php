<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderPaymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderPayment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order_id' => Order::factory(),
            'payment_method_id' => PaymentMethod::factory(),
            'type' => OrderPayment::PAYMENT_TYPES['order_payment'],
        ];
    }

    /**
     * Indicate that the stripe request/response will be added.
     *
     * @return Factory
     */
    public function stripe()
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_method_id' => 1,
                'request' => '{"amount":3400,"payment_intent_id":"pm_1JQYejJCai8r8pbfcosl0cWI","additional_data":{"description":"Payment for Order # 19","metadata":{"Order ID":19,"User Email":"earnestine.ernser@example.org"}}}',
                'response' => '{"id":"pi_3JRgH3JCai8r8pbf061sxiF9","object":"payment_intent","amount":3400,"amount_capturable":0,"amount_received":3400,"application":null,"application_fee_amount":null,"canceled_at":null,"cancellation_reason":null,"capture_method":"automatic","charges":{"object":"list","data":[{"id":"ch_3JRgH3JCai8r8pbf0UNBmh1Z","object":"charge","amount":3400,"amount_captured":3400,"amount_refunded":0,"application":null,"application_fee":null,"application_fee_amount":null,"balance_transaction":"txn_3JRgH3JCai8r8pbf0K3J8Iuo","billing_details":{"address":{"city":null,"country":null,"line1":null,"line2":null,"postal_code":"42424","state":null},"email":null,"name":null,"phone":null},"calculated_statement_descriptor":"EMANUEL CEPOI PFA","captured":true,"created":1629737125,"currency":"usd","customer":"cus_K4i4TvLVdxj3Ym","description":"Payment for Order # 19","destination":null,"dispute":null,"disputed":false,"failure_code":null,"failure_message":null,"fraud_details":[],"invoice":null,"livemode":false,"metadata":{"Order ID":"19","User Email":"earnestine.ernser@example.org"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","risk_score":42,"seller_message":"Payment complete.","type":"authorized"},"paid":true,"payment_intent":"pi_3JRgH3JCai8r8pbf061sxiF9","payment_method":"pm_1JQYejJCai8r8pbfcosl0cWI","payment_method_details":{"card":{"brand":"visa","checks":{"address_line1_check":null,"address_postal_code_check":"pass","cvc_check":null},"country":"US","exp_month":4,"exp_year":2024,"fingerprint":"0URonC78k7iDo17N","funding":"credit","installments":null,"last4":"4242","network":"visa","three_d_secure":null,"wallet":null},"type":"card"},"receipt_email":null,"receipt_number":null,"receipt_url":"https:\/\/pay.stripe.com\/receipts\/acct_1IyisDJCai8r8pbf\/ch_3JRgH3JCai8r8pbf0UNBmh1Z\/rcpt_K5s1gxQQnR5GmOKSzGvGCpqZ4uDFyJJ","refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"\/v1\/charges\/ch_3JRgH3JCai8r8pbf0UNBmh1Z\/refunds"},"review":null,"shipping":null,"source":null,"source_transfer":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"succeeded","transfer_data":null,"transfer_group":null}],"has_more":false,"total_count":1,"url":"\/v1\/charges?payment_intent=pi_3JRgH3JCai8r8pbf061sxiF9"},"client_secret":"pi_3JRgH3JCai8r8pbf061sxiF9_secret_BAQnO3IsLQmyxD2ULv1zWBddt","confirmation_method":"automatic","created":1629737125,"currency":"usd","customer":"cus_K4i4TvLVdxj3Ym","description":"Payment for Order # 19","invoice":null,"last_payment_error":null,"livemode":false,"metadata":{"Order ID":"19","User Email":"earnestine.ernser@example.org"},"next_action":null,"on_behalf_of":null,"payment_method":"pm_1JQYejJCai8r8pbfcosl0cWI","payment_method_options":{"card":{"installments":null,"network":null,"request_three_d_secure":"automatic"}},"payment_method_types":["card"],"receipt_email":null,"review":null,"setup_future_usage":null,"shipping":null,"source":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"succeeded","transfer_data":null,"transfer_group":null}',
                'payment_provider_reference_id' => 'pm_1JQYejJCai8r8pbfcosl0cWI',
            ];
        });
    }
    /**
     * Indicate that the paypal request/response will be added.
     *
     * @return Factory
     */
    public function paypal()
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_method_id' => 2,
                'request' => '{"intent":"CAPTURE","purchase_units":[{"reference_id":"RG000000022","amount":{"value":34,"currency_code":"USD"}}]}',
                'response' => '{"id":"09W81176U7024823L","intent":"CAPTURE","status":"COMPLETED","purchase_units":[{"reference_id":"RG000000015","amount":{"currency_code":"USD","value":"34.00"},"payee":{"email_address":"sb-lyxjd7157834@business.example.com","merchant_id":"F9NB99GRLJ5WE"},"shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}},"payments":{"captures":[{"id":"1PV434262P5856810","status":"COMPLETED","amount":{"currency_code":"USD","value":"34.00"},"final_capture":true,"seller_protection":{"status":"ELIGIBLE","dispute_categories":["ITEM_NOT_RECEIVED","UNAUTHORIZED_TRANSACTION"]},"seller_receivable_breakdown":{"gross_amount":{"currency_code":"USD","value":"34.00"},"paypal_fee":{"currency_code":"USD","value":"1.29"},"net_amount":{"currency_code":"USD","value":"32.71"}},"links":[{"href":"https://api.sandbox.paypal.com/v2/payments/captures/1PV434262P5856810","rel":"self","method":"GET"},{"href":"https://api.sandbox.paypal.com/v2/payments/captures/1PV434262P5856810/refund","rel":"refund","method":"POST"},{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/09W81176U7024823L","rel":"up","method":"GET"}],"create_time":"2021-08-24T14:45:44Z","update_time":"2021-08-24T14:45:44Z"}]}}],"payer":{"name":{"given_name":"John","surname":"Doe"},"email_address":"sb-on6k477157769@personal.example.com","payer_id":"YU3J8WB8JHHQU","address":{"country_code":"US"}},"create_time":"2021-08-24T14:45:25Z","update_time":"2021-08-24T14:45:44Z","links":[{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/09W81176U7024823L","rel":"self","method":"GET"}]}',
                'payment_provider_reference_id' => '78D68356JX9750705',
            ];
        });
    }
}
