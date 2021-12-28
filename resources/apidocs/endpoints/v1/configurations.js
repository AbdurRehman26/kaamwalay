/**
 * @api {post} /v1/configurations List configurations
 * @apiGroup Configurations
 * @apiName List configurations
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse AuthorizationOptional
 *
 * @apiSuccess {Object} data    A json with all the keys defined in the backend.
 * @apiSuccessExample Success Request:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "property_key": "value"
 *          }
 *      }
 */

/**
 * @api {delete} /v1/configurations Invalidate configurations
 * @apiGroup Configurations
 * @apiName Invalidate configurations
 * @apiDescription Used to invalidate configuration keys store, the endpoint require auth
 *                 and user need to have the permission to invalidate (User should be an admin).
 *
 * @apiVersion 1.0.0
 *
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data    A json with all the keys defined in the backend.
 * @apiSuccessExample Success Request:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "property_key": "value"
 *          }
 *      }
 */
