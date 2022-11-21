/**
 * @api {put} /v2/customer/profile/toggle-marketing-notifications Customer Toggle Marketing Notifications
 * @apiName Customer Toggle Marketing Notifications
 * @apiGroup Customer-Profile
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 *
 * @apiParam { Boolean } marketing_notifications_enabled If the user has opted in or out for SMS/Email marketing notifications
 *
 * @apiSuccess { Boolean } success success boolean
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "user": {
 *                  "id": 18,
 *                  "customer_number": "C00000018",
 *                  "first_name": "Jane",
 *                  "last_name": "Doe",
 *                  "full_name": "Jane Doe",
 *                  "email": "test@test.test",
 *                  "username": "test",
 *                  "phone": null,
 *                  "stripe_id": "cus_K0651IOZjCy9Wa",
 *                  "marketing_notifications_enabled": true,
 *                  "profile_image":  "http://minio:9000/robograding/users/18/files/dates/2022-11-14/6qW2XkuI_400x400.png",
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
