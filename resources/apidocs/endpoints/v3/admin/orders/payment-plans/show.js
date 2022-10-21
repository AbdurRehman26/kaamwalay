/**
 * @api {get} /v3/admin/orders/payment-plans/:id Show Payment Plan
 * @apiName Show Payment Plan
 * @apiGroup Admin Payment Plans
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Payment Plan unique ID
 *
 * @apiSuccess {Object} data Payment Plan data
 * @apiSuccess {Integer} data.id Payment plan unique ID
 * @apiSuccess {Float} data.price Payment plan price
 * @apiSuccess {Float} data.max_protection_amount Payment plan maximum protection amount
 * @apiSuccess {String} data.turnaround Payment plan turnaround time
 * @apiSuccess {Array} data.price_ranges Payment Plan Price Ranges data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 1,
 *              "price": 18,
 *              "max_protection_amount": 200,
 *              "turnaround": "20 Business Days",
 *              "price_ranges": [
 *                  {
 *                      "id": 1,
 *                      "min_cards": 1,
 *                      "max_cards": 20,
 *                      "price": 18
 *                  },
 *                  {
 *                      "id": 2,
 *                      "min_cards": 21,
 *                      "max_cards": 50,
 *                      "price": 17
 *                  },
 *                  {
 *                      "id": 3,
 *                      "min_cards": 51,
 *                      "max_cards": 100,
 *                      "price": 16
 *                  },
 *                  {
 *                      "id": 4,
 *                      "min_cards": 101,
 *                      "max_cards": 200,
 *                      "price": 15
 *                  },
 *                  {
 *                      "id": 5,
 *                      "min_cards": 201,
 *                      "max_cards": null,
 *                      "price": 14
 *                  }
 *              ]
 *         }
 *      }
 */
