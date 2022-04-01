/**
 * @api {delete} /v1/customer/orders/{orderId}/orderItems/{orderItemId} Delete Order Item
 * @apiName Delete Order Item
 * @apiGroup Customer-Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data of OrderItem Collection
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": []
 *      }
 */
