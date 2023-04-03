/**
 * @api {put} /v3/salesman/customers/{user} Update Customer Details
 * @apiName Update Customer Details
 * @apiGroup Salesman Customers
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam { String } first_name First name of the user
 * @apiParam { String } last_name Last name of the user
 * @apiParam { String } [phone] Phone number
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "first_name": "Updated",
 *          "last_name": "Name",
 *          "phone": "+1 (121) 231-3213"
 *      }
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 131,
 *              "profile_image": null,
 *              "first_name": "Updated",
 *              "last_name": "Name",
 *              "full_name": "Updated Name",
 *              "customer_number": "C00000131",
 *              "email": "example@gmail.com",
 *              "phone": "+1 (121) 231-3213",
 *              "submissions": 0,
 *              "cards_count": 0,
 *              "wallet": {
 *                  "id": 103,
 *                  "user_id": 131,
 *                  "balance": 0,
 *                  "is_active": true,
 *                  "created_at": "2023-02-20T14:09:01.000000Z",
 *                  "updated_at": "2023-02-20T14:09:01.000000Z"
 *              },
 *              "created_by": null,
 *              "created_at": "2023-02-20T14:09:01.000000Z",
 *              "updated_at": "2023-03-08T20:41:42.000000Z",
 *              "last_login_at": null,
 *          }
 *      }
 */
