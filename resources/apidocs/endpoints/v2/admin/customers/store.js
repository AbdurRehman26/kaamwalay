/**
 * @api {post} /v2/admin/customers Create Customer
 * @apiName Create Customer
 * @apiGroup Admin Customers
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} first_name User first name. Example: John
 * @apiParam {String} last_name User last name. Example: Doe
 * @apiParam {String} email User email. Example: john.doe@example.org
 * @apiParam {String} phone User phone. Example: +11234567890
 *
 * @apiSuccess {Object} data User data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *          "data": {
 *              "id": 39,
 *              "profile_image": null,
 *              "full_name": "John Doe",
 *              "customer_number": "C00000039",
 *              "email": "john.doe@example.org",
 *              "phone": "+1234567890",
 *              "submissions": 0,
 *              "cards_count": 0,
 *              "wallet": {
 *                  "id": 19,
 *                  "user_id": 39,
 *                  "balance": 0,
 *                  "is_active": true,
 *                  "created_at": "2022-07-27T20:08:43.000000Z",
 *                  "updated_at": "2022-07-27T20:08:43.000000Z"
 *              },
 *              "created_at": "2022-07-27T20:08:42.000000Z",
 *              "update_at": null
 *          }
 *      }
 */
