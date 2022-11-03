/**
 * @api {get} /api/v2/admin/salesmen/{salesman} Salesman Details
 * @apiName Salesman Details
 * @apiGroup Admin Salesmen
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Salesman unique ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "data": {
 *                   "profile_image": null,
 *                   "full_name": "Joshua M Tassone",
 *                   "customer_number": "C00005558",
 *                   "email": "brittanyxberns@gmail.com",
 *                   "phone": null,
 *                   "signed_up": "2021-12-13",
 *                   "profile_image": null",
 *                   "first_name": "Wilburn",
 *                   "last_name": "Ratke",
 *                   "commission_type": null,
 *                   "commission_value": null,
 *                   "customers": null,
 *                   "orders": null,
 *                   "commission_earned": null,
 *                   "status": null,
 *                   "sales": null
 *           }
 *      },
 */
