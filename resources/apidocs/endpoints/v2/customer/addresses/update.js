/**
 * @api {put} /v2/customer/addresses/18 Update address
 * @apiName Update Address
 * @apiGroup Customer-Addresses
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *           "first_name": "Test Update",
 *           "last_name": "Test 123",
 *           "address": "Test address 123",
 *           "address2": "Test address 123",
 *           "city": "Test 123",
 *           "state": "AB",
 *           "zip": "123A",
 *           "phone": "1312310913",
 *           "country_id": "2"
 *       }
 *  @apiSuccess {Object} data Order object
 *
 *  * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 1,
 *              "user_id": 2,
 *              "first_name": "Test Update",
 *              "last_name": "Test 123",
 *              "address": "Test Address 123",
 *              "address2": "Test Address 123",
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
