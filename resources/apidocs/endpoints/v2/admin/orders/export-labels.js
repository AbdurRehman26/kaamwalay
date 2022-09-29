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
 *      {
 *          "message": "OK",
 *          "url": "http://minio:9000/robograding/order-labels/RG000000014_label_5806af68-2f24-4b71-b615-bfbe6bf3705d.xlsx"
 *      }
 */
