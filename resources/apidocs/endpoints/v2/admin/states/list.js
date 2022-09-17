/**
 * @api {get} /v2/admin/addresses/states List States
 * @apiName List States
 * @apiGroup Admin Addresses
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} country_id optional, to display only states for specific country
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
 *                  "name": "Alabama",
 *                  "country": {
 *                      "id": 1,
 *                      "code": "US",
 *                      "name": "United States",
 *                      "phone_code": "1"
 *                  }
 *              },
 *              {
 *                  "id": 2,
 *                  "code": "AK",
 *                  "name": "Alaska",
 *                  "country": {
 *                      "id": 1,
 *                      "code": "US",
 *                      "name": "United States",
 *                      "phone_code": "1"
 *                  }
 *              },
 *              {
 *                  "id": 3,
 *                  "code": "AS",
 *                  "name": "American Samoa",
 *                  "country": {
 *                      "id": 1,
 *                      "code": "US",
 *                      "name": "United States",
 *                      "phone_code": "1"
 *                  }
 *              }
 *          ]
 *      }
 */
