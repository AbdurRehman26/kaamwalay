/**
 * @api {post} /v3/admin/attach-tags Attach Tags to a Model
 * @apiName Taggable Model
 * @apiGroup Taggable Model
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} model Name of model for which data is being tagged. e.g. user, order.
 * @apiParam {Array} model_ids Model Ids to attach tags to E.g. model_ids=[1, 2]
 * @apiParam {Array} tags For attaching it to models E.g. tags=["abandoned"]
 *
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "model": "order",
 *      "model_ids": [1, 2],
 *      "tags": ["abandoned"],
 *  }
 *
 * @apiSuccess {Object}
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "success": true,
 *          }
 *      }
 */
