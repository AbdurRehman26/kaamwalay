/**
 * @api {put} /v3/admin/orders/{order}/update-shipping-address Update Order Shipping Address
 * @apiName Update Shipping Address
 * @apiGroup Admin Orders
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam { String } country_code ISO-2 code that identifies the country
 * @apiParam { String } first_name First name of the person in the address * @apiParam { String } last_name Last name of the person in the address
 * @apiParam { String } address Street address
 * @apiParam { String } [address_2] Apt, suite, building, floor, etc
 * @apiParam { String } city City name
 * @apiParam { String } state State code coming from a dropdown in case of US, or text input otherwise
 * @apiParam { String } zip Zip code of the address
 * @apiParam { String } [phone] Phone number
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "first_name": "Updated",
 *          "last_name": "Name",
 *          "country_code": "GB",
 *          "city": "London",
 *          "state": "London",
 *          "zip": "12345",
 *          "address": "Lorem Ipsum",
 *          "address_2": "dolor sit",
 *          "phone": "+44123456789"
 *      }
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "message": "Shipping Address Updated successfully."
 *      }
 */
