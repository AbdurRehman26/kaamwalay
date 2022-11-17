/**
 * @api {put} /api/v2/admin/salesmen/{user} Update Salesman
 * @apiName Update Salesman
 * @apiGroup Admin Salesmen
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} first_name User first name. Example: John
 * @apiParam {String} last_name User last name. Example: Doe
 * @apiParam {String} phone User phone. Example: +11234567890
 * @apiParam {String} profile_image User Profile Image. Example: +11234567890
 * @apiParam {String} is_active User Status. Example: true
 * @apiParam {String} commission_type Salesman Commission Structure Type. Example: 0
 * @apiParam {String} commission_value Salesman Commission Structure Value. Example: 60
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "first_name": "John",
 *          "last_name": "Doe",
 *          "phone": "+1234567890",
 *          "profile_image": null,
 *          "is_active": true,
 *          "commission_type": 0,
 *          "commission_value": 60
 *      }
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
 *              "update_at": null
 *          }
 *      }
 */
