/**
 * @api {get} /v2/customer/addresses/countries List Countries
 * @apiName List Countries
 * @apiGroup Customer-Addresses
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data States data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "code": "US",
 *                  "name": "United States",
 *                  "is_enabled": 1
 *              },
 *              {
 *                  "id": 2,
 *                  "code": "AU",
 *                  "name": "Australia",
 *                  "is_enabled": 1
 *              },
 *              {
 *                  "id": 3,
 *                  "code": "CA",
 *                  "name": "Canada",
 *                  "is_enabled": 1
 *              }
 *          ]
 *      }
 */
