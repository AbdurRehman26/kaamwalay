/**
 * @api {post} /v2/customer/addresses Add new address
 * @apiName Add New Address
 * @apiGroup Customer-Addresses
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "customer_address": {
 *              "first_name": "Test",
 *              "last_name": "Test",
 *              "address": "Test address",
 *              "address2": "Test address 2",
 *              "city": "Test",
 *              "state": "AB",
 *              "zip": "123A",
 *              "phone": "1312310913",
 *              "country_id": "2"
 *          },
 *       }
 *  @apiSuccess {Object} data Order object
 *
 *  * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 1,
 *              "user_id": 2,
 *              "first_name": "Test",
 *              "last_name": "Test",
 *              "address": "Test Address",
 *              "address2": "Test Address 2",
 *              "state": "AB",
 *              "zip": "70691",
 *              "phone": "+1-351-520-6142",
 *              "country": {
 *                  "id": 1,
 *                  "code": "US",
 *                  "name": "United States"
 *              }
 *         }
 *      }
 */
