/**
 * @api {post} /customer/update-profile Update Customer Profile
 * @apiName Update Customer Profile
 * @apiGroup Customer
 *
 * @apiUse header_main
 *
 * @apiParam { String } [first_name] First Name of the User
 * @apiParam { String } [last_name] Last Name of the User
 * @apiParam { String } [email] email Unique Email of the User
 * @apiParam { String } [username] username Unique Username of the User
 * @apiParam { String } [current_password] Current Password of the User
 * @apiParam { String } [password] Password of the User
 * @apiParam { String } [password_confirmation] Password Confirmation of the User
 * @apiParam { String } [phone] phone number of the User
 * @apiParam { String } [profile_image] profile image of the User
 * @apiParam { boolean } [email_subscription] email subscription selection of the User
 *
 * @apiSuccess { String } data.token authentication token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *     "data": {
 *         "id": 2907,
 *         "customer_number": "aFZPgDBkeT",
 *         "first_name": "Carlos",
 *         "last_name": "Morales",
 *         "email": "admin@robograding.com",
 *         "username": "elinore17",
 *         "phone": null,
 *         "stripe_id": null,
 *         "roles": [
 *                      {
 *                          "id": 1,
 *                          "name": "admin"
 *                      }
 *              ]
 *          }
 *      }
 */
