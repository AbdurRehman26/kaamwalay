/**
 * @api {get} /v2/customer/cards/categories Card Categories
 * @apiName Card Categories
 * @apiGroup User Cards
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *
 * @apiSuccess {Object} data Card Categories collection
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": [
 *             {
 *                 "id": 1,
 *                 "name": "John"
 *             },
 *             {
 *                 "id": 2,
 *                 "name": "Doe"
 *             }
 *         ]
 *     }
 */
