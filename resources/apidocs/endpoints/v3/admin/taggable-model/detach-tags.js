/**
 * @api {post} /v3/admin/detach-tags Detach Tags from a Model
 * @apiName Detach Tags From Models
 * @apiGroup Taggable Model
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} model Name of model for which has the tags. e.g. user, order.
 * @apiParam {Array} model_ids Model Ids to detach tags from E.g. model_ids=[1, 2]
 * @apiParam {Array} tags For detaching from models E.g. tags=["abandoned"]
 *
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "model": "order",
 *      "model_ids": [1, 2],
 *      "tags": ["abandoned"],
 *  }
 *
 * @apiSuccess {Object} data
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "success": true,
 *          }
 *      }
 */
