/**
 * @api {patch} /v2/customer/orders/{order}/update-billing-address Update Order Billing Address
 * @apiName Update Order
 * @apiGroup Customer-Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam { String } first_name First name of the person in the address
 * @apiParam { String } last_name Last name of the person in the address
 * @apiParam { String } address Street address
 * @apiParam { String } [address_2] Apt, suite, building, floor, etc
 * @apiParam { String } city City name
 * @apiParam { String } state State code coming from a dropdown in case of US, or text input otherwise
 * @apiParam { String } zip Zip code of the address
 * @apiParam { String } [phone] Phone number
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "first_name": "John",
 *          "last_name": "Doe",
 *          "address": "123 Lorem St",
 *          "address_2": "",
 *          "city": "Lorem",
 *          "state": "Ipsum",
 *          "zip": "12345",
 *          "phone": "+1 (123) 456-7890",
 *          "country_code": "US"
 *      }
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
            "success": true,
            "message": "Billing Address updated successfully."
        }
 */
