/**
 * @api {get} /v2/admin/customers/{customer} Customer Details
 * @apiName Customer Details
 * @apiGroup Admin Customers
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Customer unique ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *               "profile_image": null,
 *               "full_name": "Joshua M Tassone",
 *               "customer_number": "C00005558",
 *               "email": "brittanyxberns@gmail.com",
 *               "phone": null,
 *               "submissions": 3,
 *               "created_by": {
 *                   "id": 1,
 *                   "customer_number": "thdJr5lLEb",
 *                   "first_name": "Admin",
 *                   "last_name": "Admin",
 *                   "email": "admin@example.org",
 *                   "username": "gregoria.champlin",
 *                   "profile_image": null,
 *                   "phone": null,
 *                   "stripe_id": null,
 *                   "roles": [
 *                       {
 *                           "id": 1,
 *                           "name": "admin"
 *                       }
 *                   ],
 *                   "wallet": null
 *               },
 *               "created_at": "2021-12-13",
 *               "updated_at": "2021-12-13",
 *               "last_login_at": "2022-07-29T14:54:48.000000Z",
 *           },
 *        }
 */
