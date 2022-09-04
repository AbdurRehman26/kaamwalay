/**
 * @api {put} /v2/admin/orders/{id}/labels Update and Export Order Labels
 * @apiName Update and Export Order Labels
 * @apiGroup Admin Orders
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id Order Unique ID
 * @apiParam {Array} data Labels data
 * @apiParam {String} data.certificate_number Card Certificate Number. Example: 09000000
 * @apiParam {String} data.line_one Label first line. Example: 2022 YU-GI-OH!
 * @apiParam {String} data.line_two Label second line. Example: TEST YUGIOH 2
 * @apiParam {String} data.line_three Label third line (can be empty). Example: TEST YUGIOH SET 4
 * @apiParam {String} data.line_four Label fourth line, usually card number. Example: #TY2 *
 * @apiParam {Boolean} data.persist_changes If true, DB record for the label will be updated with sent lines.
 *
 *  @apiParamExample {json} Request-Example:
 * {
 *     "data": [
 *         {
 *             "certificate_number": "09000000",
 *             "line_one": "2021 Pokemon SWSH 1",
 *             "line_two": "SCATTERBUG",
 *             "line_three": "Battle Styles",
 *             "line_four": "#11",
 *             "persist_changes": true
 *         }
 *     ]
 *
 * }
 *
 * @apiSuccess {Object} data User data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *          "data": {
 *              "card_label_id": 9,
 *              "line_one": "2022 YU-GI-OH!",
 *              "line_two": "TEST YUGIOH 2",
 *              "line_three": "TEST YUGIOH SET 4",
 *              "line_four": "#TY2",
 *              "card_product": {
 *                  "id": 109,
 *                  "long_name": "2022 YU-GI-OH! Test Yugioh Series Test yugioh set 4 ty2",
 *                  "short_name": "",
 *                  "name": "Test Yugioh 2",
 *                  "card_category_name": "YU-GI-OH!",
 *                  "card_set_name": "Test yugioh set 4",
 *                  "card_series_name": "Test Yugioh Series",
 *                  "release_date": "2022-02-17T00:00:00.000000Z",
 *                  "release_year": 2022,
 *                  "card_number_order": "ty2",
 *                  "image_path": "http://minio:9000/robograding/users/1/files/dates/2022-02-11/c9ae762c79a9f5911704faa0570f3d3578ff5c02.png",
 *                  "language": "English",
 *                  "variant": "",
 *                  "surface": "",
 *                  "edition": "Unlimited",
 *                  "added_by_customer": false
 *              }
 *          }
 *      }
 */
