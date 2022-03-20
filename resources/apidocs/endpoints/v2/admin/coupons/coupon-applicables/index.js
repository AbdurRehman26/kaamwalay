/**
 * @api {get} /v2/admin/coupon-applicables List Coupon Applicables
 * @apiName List Coupon Applicables
 * @apiGroup Admin Coupons
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Coupon Applicable data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": [
 *                {
 *                    "id": 1,
 *                    "code": "service_fee",
 *                    "label": "Total Service Fee",
 *                    "description": "Coupon code will be applied to total service fee value only",
 *                    "is_active": true
 *                 },
 *                 {
 *                    "id": 2,
 *                    "code": "service_level",
 *                    "label": "Select Service Levels",
 *                    "description": "Coupon code will be applied to selected service levels only",
 *                    "is_active": true
 *                 },
 *                 {
 *                    "id": 3,
 *                    "code": "user",
 *                    "label": "Select Users",
 *                    "description": "Coupon code will be applied to selected users only",
 *                    "is_active": true
 *                 },
 *                 {
 *                    "id": 4,
 *                    "code": "shipping_fee",
 *                    "label": "Total Shipping Fee",
 *                    "description": "Coupon code will be applied to total shipping fee value only",
 *                    "is_active": true
 *                 },
 *               },
 *            ],
 *        }
 */
