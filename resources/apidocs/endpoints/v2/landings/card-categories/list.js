/**
 * @api {get} /v2/pop/categories List Card Categories
 * @apiName List Card Categories
 * @apiGroup Landing Card Categories
 *
 * @apiVersion 2.0.0
 *
 * @apiSuccess {Object} data Card Categories data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "name": "Pokemon",
 *                  "image_url": "https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Pokemon.png"
 *              },
 *              {
 *                  "id": 2,
 *                  "name": "MetaZoo",
 *                  "image_url": "https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Metazoo.png"
 *              },
 *              {
 *                  "id": 3,
 *                  "name": "Dragon Ball Super",
 *                  "image_url": "https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/DragonBall.png"
 *              },
 *              {
 *                  "id": 4,
 *                  "name": "YU-GI-OH!",
 *                  "image_url": "https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Yugioh.png"
 *              },
 *              {
 *                  "id": 5,
 *                  "name": "Basketball",
 *                  "image_url": "https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Basketball.png"
 *              },
 *          ]
 *      }
 */
