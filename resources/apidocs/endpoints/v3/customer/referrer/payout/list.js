/**
 * @api {get} /v3/customer/referrer/payouts List Customer Payouts
 * @apiName List Customer Payouts
 * @apiGroup Customer-Payouts
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data Customer Payouts
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "date_initiated": '2022-06-05 06:35:25',
 *                  "completed_at": null,
 *                  "payout_account": "bgusikowski@hotmail.com",
 *                  "status": 'Pending',
 *                  "amount": 18
 *              },
 *              {
 *                 "id": 1,
 *                  "date_initiated": '2022-06-05 06:35:25',
 *                  "completed_at": null,
 *                  "payout_account": "bgusikowski@hotmail.com",
 *                  "status": 'Pending',
 *                  "amount": 18
 *              },
 *          ]
 *      }
 */
