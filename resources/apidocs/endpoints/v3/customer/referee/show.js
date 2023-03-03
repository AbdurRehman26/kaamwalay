/**
 * @api {get} /v3/customer/referee/coupon Get Referee Coupon
 * @apiName Get Referee Coupon
 * @apiGroup Referee
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data containing referee coupon
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *             "id": 1,
 *             "code": "HVTGSYS",
 *             "available_from": "2021-12-30T10:18:01.000000Z",
 *             "available_till": "2021-12-30T10:18:01.000000Z",
 *          }
 *      }
 */