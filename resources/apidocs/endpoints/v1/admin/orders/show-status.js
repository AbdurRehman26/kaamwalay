/**
 * @api {get} /v1/admin/orders/15/status-history Show order status
 * @apiName Show order status
 * @apiGroup Admin Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Order object
 * @apiParam {Array} [include] For including relationships [order, orderStatus, user]
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": [
 *               {
 *                   "id": 1,
 *                   "notes": null,
 *                   "order_id": 15,
 *                   "order_status_id": 1,
 *                   "created_at": "2021-09-27T13:35:50.000000Z",
 *                   "updated_at": "2021-09-27T13:35:50.000000Z"
 *               },
 *               {
 *                   "id": 2,
 *                   "notes": null,
 *                   "order_id": 15,
 *                   "order_status_id": 2,
 *                   "created_at": "2021-09-27T13:35:59.000000Z",
 *                   "updated_at": "2021-09-27T13:35:59.000000Z"
 *               },
 *               {
 *                   "id": 14,
 *                   "notes": null,
 *                   "order_id": 15,
 *                   "order_status_id": 4,
 *                   "created_at": "2021-09-28T18:53:24.000000Z",
 *                   "updated_at": "2021-09-28T18:53:24.000000Z"
 *               }
 *           ]
 *      }
 */
