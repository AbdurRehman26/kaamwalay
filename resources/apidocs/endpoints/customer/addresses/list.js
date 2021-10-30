/**
 * @api {get} /customer/addresses List saved addresses
 * @apiName List Saved Addresses
 * @apiGroup Customer-Addresses
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data Saved addresses data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "user_id": 2,
 *                  "first_name": "Isai",
 *                  "last_name": "Price",
 *                  "address": "Feestport",
 *                  "state": "eos",
 *                  "zip": "70691",
 *                  "phone": "+1-351-520-6142",
 *                  "flat": "3",
 *                  "country": {
 *                      "id": 6,
 *                      "code": "BS",
 *                      "name": "Azerbaijan"
 *                  }
 *              },
 *              {
 *                  "id": 2,
 *                  "user_id": 2,
 *                  "first_name": "Isai",
 *                  "last_name": "Price",
 *                  "address": "Feestport",
 *                  "state": "eos",
 *                  "zip": "70691",
 *                  "phone": "+1-351-520-6142",
 *                  "flat": "3",
 *                  "country": {
 *                      "id": 6,
 *                      "code": "BS",
 *                      "name": "Azerbaijan"
 *                  }
 *              }
 *          ]
 *      }
 */
