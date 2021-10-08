/**
 * @api {get} /customer/orders/payment-methods All Payment Methods
 * @apiName List All Payment Methods
 * @apiGroup Payment-Methods
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data payment methods
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "code": "stripe",
 *                  "name": "Credit or Debit Card"
 *              },
 *              {
 *                  "id": 2,
 *                  "code": "paypal",
 *                  "name": "Paypal"
 *              },
 *              {
 *                  "id": 3,
 *                  "code": "magnam",
 *                  "name": "Blanche"
 *              },
 *              {
 *                  "id": 4,
 *                  "code": "provident",
 *                  "name": "Hermann"
 *              },
 *              {
 *                  "id": 5,
 *                  "code": "sed",
 *                  "name": "Ryleigh"
 *              },
 *              {
 *                  "id": 6,
 *                  "code": "iusto",
 *                  "name": "Anibal"
 *              },
 *              {
 *                  "id": 7,
 *                  "code": "sed",
 *                  "name": "Melvin"
 *              },
 *              {
 *                  "id": 8,
 *                  "code": "dolorum",
 *                  "name": "Emile"
 *              },
 *              {
 *                  "id": 9,
 *                  "code": "magnam",
 *                  "name": "Lindsey"
 *              },
 *              {
 *                  "id": 10,
 *                  "code": "voluptas",
 *                  "name": "Loyce"
 *              },
 *              {
 *                  "id": 11,
 *                  "code": "nam",
 *                  "name": "Jadyn"
 *              },
 *              {
 *                  "id": 12,
 *                  "code": "iste",
 *                  "name": "Audrey"
 *              },
 *          ]
 *      }
 */
