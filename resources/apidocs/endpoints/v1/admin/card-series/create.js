/**
 * @api {post} /v1/admin/series Create Card Series
 * @apiName Create Card Series
 * @apiGroup Admin Card Series
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "card_category_id": 1,
 *      "name": "Test Series",
 *      "image_path": "https://www.google.com",
 *  }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 123,
 *              "name": "Admin Series",
 *              "image_path": "https://www.google.com",
 *          }
 *      }
 */
