/**
 * @api {put} /admin/orders/11/notes Update Order Notes
 * @apiName Update Order Notes
 * @apiGroup Admin Orders
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} notes For including notes in order [notes = Lorem Ipsum Dolor Sit Amet]
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "notes": "Lorem Ipsum Dolor Sit Amet"
 *      }
 *
 * @apiSuccess {Object} data Card object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": {
 *             "id": 15,
 *             "order_number": "RG000000015",
 *             "number_of_cards": 2,
 *             "total_declared_value": 2,
 *             "service_fee": 40,
 *             "shipping_fee": 14,
 *             "grand_total": 54,
 *             "created_at": "2021-09-27T13:35:49.000000Z",
 *             "auto_saved_at": "2021-10-07T04:24:55.000000Z",
 *             "notes": "Lorem Ipsum Dolor Sit Amet"
 *          }
 *      }
 */
