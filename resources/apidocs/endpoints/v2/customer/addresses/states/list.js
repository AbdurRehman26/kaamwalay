/**
 * @api {get} /v2/customer/addresses/states List Sates
 * @apiName List States
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
 *                  "code": "AL",
 *                  "name": "Alabama"
 *              },
 *              {
 *                  "id": 2,
 *                  "code": "AK",
 *                  "name": "Alaska"
 *              },
 *              {
 *                  "id": 3,
 *                  "code": "AS",
 *                  "name": "American Samoa"
 *              }
 *          ]
 *      }
 */
