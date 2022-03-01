/**
 * @api {post} /v1/admin/sets Create Card Set
 * @apiName Create Card Set
 * @apiGroup Admin Card Sets
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "card_series_id": 1,
 *      "name": "admin new set",
 *      "image_path": "https://www.google.com",
 *      "release_date": "2022-02-02"
 *  }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 123,
 *              "name": "admin new set",
 *              "release_date": "2022-02-02T20:21:00.000000Z",
 *              "image_path": "https://www.google.com",
 *          }
 *      }
 */
