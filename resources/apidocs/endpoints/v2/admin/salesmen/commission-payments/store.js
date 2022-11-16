/**
 * @api {post} /api/v2/admin/salesmen/{salesman}/commission-payments Create Salesman Commission Payment
 * @apiName Create Salesman Commission Payment
 * @apiGroup Admin Salesmen
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} notes Payment notes if any. Example: Test notes
 * @apiParam {String} file_url URL of the uploaded file. Example: "https://file.com/test.png"
 * @apiParam {Number} amount Amount paid. Example: 10.0
 *
 * @apiSuccess {Object} data Salesman commission payment data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *          "data": {
 *              "id": 1,
 *               "amount": 10.0,
 *               "added_by": {
 *                   "id": 1,
 *                   "first_name": "John",
 *                   "last_name": "Doe",
 *                   "full_name": "John Doe",
 *               },
 *               "salesman": {
 *                   "id": 1,
 *                   "first_name": "John",
 *                   "last_name": "Doe",
 *                   "full_name": "John Doe",
 *               },
 *               "notes": "Test Notes",
 *               "file_url": "https://file.com/test.png",
 *               "created_at": "2021-12-13",
 *          }
 *      }
 */
