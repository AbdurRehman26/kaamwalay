/**
 * @api {get} /v2/auth/me Logged In User
 * @apiName Logged In User Detail
 * @apiGroup Authentication
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data containing token and user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "user": {
 *                  "id": 18,
 *                  "first_name": "Jane",
 *                  "last_name": "Doe",
 *                  "email": "test@test.test",
 *                  "username": "test",
 *                  "phone": null,
 *                  "stripe_id": "cus_K0651IOZjCy9Wa",
 *                  "roles": [
 *                      {
 *                          "id": 2,
 *                          "name": "customer"
 *                      }
 *                  ],
 *                  "wallet": {
 *                      "balance": 300.00
 *                  }
 *              }
 *          }
 *      }
 */
