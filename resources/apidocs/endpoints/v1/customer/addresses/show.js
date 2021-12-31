/**
 * @api {get} /v1/customer/addresses/8 Show saved address
 * @apiName Show Saved Address
 * @apiGroup Customer-Addresses
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Address unique ID
 *
 * @apiSuccess {Object} data Payment Plan data
 * @apiSuccess {Integer} data.id Address unique ID
 * @apiSuccess {Integer} data.user_id Associated user id
 * @apiSuccess {String} data.first_name Customer first name on address
 * @apiSuccess {String} data.last_name Customer last name on address
 * @apiSuccess {String} data.address Customer address
 * @apiSuccess {String} data.state State
 * @apiSuccess {String} data.zip Zip
 * @apiSuccess {String} data.phone Phone
 * @apiSuccess {String} data.flat Apartment (optional)
 * @apiSuccess {Object} data.country Country data
 * @apiSuccess {Integer} data.country.id Country unique ID
 * @apiSuccess {String} data.country.code Country code
 * @apiSuccess {String} data.country.code Country name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 1,
 *              "user_id": 2,
 *              "first_name": "Isai",
 *              "last_name": "Price",
 *              "address": "Feestport",
 *              "state": "eos",
 *              "zip": "70691",
 *              "phone": "+1-351-520-6142",
 *              "flat": "3",
 *              "country": {
 *                  "id": 6,
 *                  "code": "BS",
 *                  "name": "Azerbaijan"
 *              }
 *         }
 *      }
 */
