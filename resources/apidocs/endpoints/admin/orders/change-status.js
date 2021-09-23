/**
 * @api {post} /admin/orders/15/status-history Change order status
 * @apiName Change order status
 * @apiGroup Admin Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Order object
 * @apiParam {Array} [include] For including relationships [order, orderStatus]
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 1,
 *              "order_id": 2,
 *              "order_status_id": 3,
 *              "notes": null,
 *              "created_at": "2021-09-14T23:49:45.000000Z",
 *              "updated_at": "2021-09-14T23:49:45.000000Z"
 *          }
 *      }
 */
