/**
 * @api {post} /v3/customer/referrer/payouts Create Payout
 * @apiName Create Payout
 * @apiGroup Customer-Payouts
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "amount": 100,
 *          "payout_account": 'something@gmail.com',
 *      }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *    {
 *        "data": {
 *                "id": 1,
 *                "date_initiated": '2022-06-05 06:35:25',
 *                "completed_at": null,
 *                "payout_account": "bgusikowski@hotmail.com",
 *                "status": 'Pending',
 *                "amount": 18
 *        }
 *    }
 */
