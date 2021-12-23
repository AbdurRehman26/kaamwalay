/**
 * @api {get} /configurations List configurations
 * @apiGroup Configurations
 * @apiName List configurations
 *
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
 * @api {delete} /configurations Invalidate configurations
 * @apiGroup Configurations
 * @apiName Invalidate configurations
 * @apiDescription Used to invalidate configuration keys store, the endpoint require auth
 *                 and user need to have the permission to invalidate (User should be an admin).
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
