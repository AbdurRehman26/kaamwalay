/**
 * @api {post} /customer/orders Order create
 * @apiName Order Create
 * @apiGroup Customer-Orders
 *
 * @apiUse header_main
 * @apiUse authorization
 *
 * @apiParam { payment_plan_id } 
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
         {
            "data": {
                "id": 1,
                "order_number": "b9f7df2e-3168-3b96-ad08-7ef64467f0d9",
            }
         }
 */
