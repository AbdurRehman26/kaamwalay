/**
 * @api {get} /customer/orders/shipping-methods List Shipping methods
 * @apiName List Shipping Methods
 * @apiGroup Shipping-Methods
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Shipment method data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "code": "insured_shipping",
 *                  "name": "Insured Shipping"
 *              },
 *              {
 *                  "id": 2,
 *                  "code": "doloribus",
 *                  "name": "Marjolaine"
 *              },
 *              {
 *                  "id": 3,
 *                  "code": "beatae",
 *                  "name": "Alexander"
 *              },
 *              {
 *                  "id": 4,
 *                  "code": "minima",
 *                  "name": "Madelyn"
 *              },
 *              {
 *                  "id": 5,
 *                  "code": "qui",
 *                  "name": "Declan"
 *              },
 *              {
 *                  "id": 6,
 *                  "code": "at",
 *                  "name": "Otis"
 *              },
 *              {
 *                  "id": 7,
 *                  "code": "aut",
 *                  "name": "Randi"
 *              },
 *              {
 *                  "id": 8,
 *                  "code": "omnis",
 *                  "name": "Jaeden"
 *              },
 *              {
 *                  "id": 9,
 *                  "code": "voluptas",
 *                  "name": "Cora"
 *              },
 *              {
 *                  "id": 10,
 *                  "code": "esse",
 *                  "name": "Onie"
 *              },
 *              {
 *                  "id": 11,
 *                  "code": "quis",
 *                  "name": "Rico"
 *              },
 *          ]
 *      }
 */
