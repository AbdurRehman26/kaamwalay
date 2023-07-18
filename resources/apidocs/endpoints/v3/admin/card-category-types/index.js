/**
 * @api {get} /v3/admin/cards/category-types List Category Types
 * @apiName List Category Types
 * @apiGroup Admin Card Category Type
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Card Category Type data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    "data":[
 *       {
 *          "id":1,
 *          "name":"Sports",
 *       },
 *    ],
 *    "links":{
 *       "first":"http:\/\/robograding.test\/api\/v3\/admin\/cards\/category-types?page=1",
 *       "last":"http:\/\/robograding.test\/api\/v3\/admin\/cards\/category-types?page=17",
 *       "prev":null,
 *       "next":"http:\/\/robograding.test\/api\/v3\/admin\/cards\/category-types?page=2"
 *    },
 *    "meta":{
 *       "current_page":1,
 *       "from":1,
 *       "last_page":17,
 *       "links":[
 *          {
 *             "url":null,
 *             "label":"&laquo; Previous",
 *             "active":false
 *          },
 *       ],
 *       "path":"http:\/\/robograding.test\/api\/v3\/admin\/cards\/category-types",
 *       "per_page":24,
 *       "to":24,
 *       "total":2
 *    }
 * }
 */
