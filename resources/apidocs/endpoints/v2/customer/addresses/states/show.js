/**
 * @api {get} /v2/customer/addresses/states/:id Show State
 * @apiName Show State
 * @apiGroup Customer-Addresses
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} id State unique ID
 *
 * @apiSuccess {Object} data State data
 * @apiSuccess {Integer} data.id State unique ID
 * @apiSuccess {String} data.code State code
 * @apiSuccess {String} data.name State name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "id": 1,
 *              "code": "AL",
 *              "name": "Alabama"
 *         }
 *      }
 */
