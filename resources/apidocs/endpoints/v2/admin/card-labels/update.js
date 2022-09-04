/**
 * @api {put} /v2/admin/cards/labels/{cardLabelId} Update Card Label
 * @apiName Update Card Label
 * @apiGroup Admin Card Labels
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} cardLabelId Card Label Unique ID
 * @apiParam {String} line_one Label first line. Example: 2022 YU-GI-OH!
 * @apiParam {String} line_two Label second line. Example: TEST YUGIOH 2
 * @apiParam {String} line_three Label third line (can be empty). Example: TEST YUGIOH SET 4
 * @apiParam {String} line_four Label fourth line, usually card number. Example: #TY2
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
