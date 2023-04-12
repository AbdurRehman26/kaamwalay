/**
 * @api {post} /v3/admin/orders/mark-abandoned Mark order abandoned
 * @apiName Mark Order Abandoned
 * @apiGroup Admin Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 @apiParamExample {json} Request-Example:
 *      {
 *              "items": [18]
 *      }
 *
 * @apiSuccess {Object} data object * @apiSuccess {Object} data object
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "success": true,
 *              "message": "Order Abandoned successfully",
 *          }
 *      }
 */
