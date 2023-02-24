/**
 * @api {post} /api/v3/admin/referral-program/get-overview-stat Get Overview Stats
 * @apiName Get Overview Stats
 * @apiGroup Admin Referral Program
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} stat_name The stat that we wanna obtain, sales | commission_earned | commission_paid | orders | cards
 * @apiParam {String} time_filter For what range of time we want the stat, this_month | last_month | this_year | last_year | custom
 * @apiParam {String} [start_date] required on custom range, initial date for the range, Ex: 2022-11-16
 * @apiParam {String} [end_date] required on custom range, end date for the range, Ex: 2022-11-30
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "stat_name": "sales",
 *          "time_filter": "custom",
 *          "start_date": "2022-11-16",
 *          "end_date": "2022-11-30"
 *      }
 *
 * @apiSuccess {Object} data User data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *          "data": 32
 *        }
 */
