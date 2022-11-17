/**
 * @api {post} /api/v2/admin/salesman/{user}/remove-salesman-role Remove Salesman Role
 * @apiName Remove Salesman Role
 * @apiGroup Admin Salesmen
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Number} user Salesman User Id. Example: 39
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
 *              "email": "john.doe@example.org",
 *              "phone": "+1234567890",
 *              "commission_type": 0,
 *              "commission_value": 60,
 *              "customers": 15,
 *              "orders": 15,
 *              "commission_earned": 15,
 *              "status": 1,
 *              "sales": 1,
 *              "created_at": "2022-07-27T20:08:42.000000Z",
 *              "update_at": "2022-07-28T20:08:42.000000Z"
 *          }
 *      }
 */
