/**
 * @api {delete} /v2/admin/orders/15 Cancel order
 * @apiName Cancel order
 * @apiGroup Admin Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiQuery {orderId} order resource ID
 * @apiSuccess (204) No Content
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 No-Content
 *        {
 *        }
 */
