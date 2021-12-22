/**
 * @api {get} /admin/couponable/entities List Couponable Entites
 * @apiName List Couponable Entities
 * @apiGroup Admin Coupons
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Couponable Entities (Example of payment plans)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                    "id": 1,
 *                    "price": 20,
 *                 },
 *                 {
 *                    "id": 2,
 *                    "price": 40,
 *                 },
 *            ],
 *        }
 */
