/**
 * @api {post} /v2/customer/orders/{order}/update-billing-address Update Order Billing Address
 * @apiName Update Order
 * @apiGroup Customer-Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "first_name": "John",
 *          "last_name": "Doe",
 *          "address": "Doe",
 *          "city": "Doe",
 *          "state": 10.00,
 *          "zip": 10.00,
 *          "phone": 10.00,
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
