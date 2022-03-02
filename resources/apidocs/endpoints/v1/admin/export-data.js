/**
 * @api {post} /v1/admin/export-data Export Data of a Model
 * @apiName Export Data
 * @apiGroup Admin Export Data
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} model Name of model for which data is being exported. e.g. user, order.
 * @apiParam {Array} [filter[search]] For searching the model (if model supports it) E.g. filter[search]=test@test.com
 * @apiParam {string} [sort] For sorting records (if model supports it). E.g. sort=grand_total. Default: created_at DESC
 * @apiParam {Array} [include] For including relationships (if model supports it) e.g. invoice, paymentPlan, orderItems, orderStatus, orderPayment, billingAddress
 *
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "model": "user",
 *      "filter[search]": "test@test.com",
 *      "sort": 'created_at',
 *      "include[]": "invoice",
 *  }
 *
 * @apiSuccess {Object} data Export Data object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "file_url": 'http://google.com/file.xlsx',
 *          }
 *      }
 */
