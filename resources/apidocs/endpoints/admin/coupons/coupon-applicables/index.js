/**
 * @api {get} /admin/coupon-applicables List Coupon Applicables
 * @apiName List Coupon Applicables
 * @apiGroup Admin Coupons
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
 *                    "code": "service_fee",
 *                    "label": "Total Service Fee",
 *                    "api_suffix": "",
 *                    "description": "Coupon code will be applied to total service fee value only",
 *                    "is_active": true
 *                 },
 *                 {
 *                    "code": "service_level",
 *                    "label": "Select Service Levels",
 *                    "api_suffix": "payment_plans",
 *                    "description": "Coupon code will be applied to selected service levels only",
 *                    "is_active": true
 *                 },
 *                 {
 *                    "code": "user",
 *                    "label": "Select Users",
 *                    "api_suffix": "users",
 *                    "description": "Coupon code will be applied to selected users only",
 *                    "is_active": true
 *                 },
 *                 {
 *                    "code": "shipping_fee",
 *                    "label": "Total Shipping Fee",
 *                    "api_suffix": "",
 *                    "description": "Coupon code will be applied to total shipping fee value only",
 *                    "is_active": true
 *                 },
 *               },
 *            ],
 *        }
 */
