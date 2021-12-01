/**
 * @api {get} /admin/cards/series List series
 * @apiName List Series
 * @apiGroup Admin Card Series
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} category_id Unique category id associated to series
 *
 * @apiSuccess {Object} data Card Series data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "data": [
 *              {
 *                  "id": 1,
 *                  "name": "Sword & Shield Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Sword-Shield.logo.286.png"
 *              },
 *              {
 *                  "id": 2,
 *                  "name": "Sun & Moon Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Sun-Moon.logo.205.png"
 *              },
 *              {
 *                  "id": 3,
 *                  "name": "XY Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/XY.logo.142.png"
 *              },
 *              {
 *                  "id": 4,
 *                  "name": "Black & White Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Black-White.logo.1.png"
 *              },
 *              {
 *                  "id": 5,
 *                  "name": "Black & White Promos Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Black-White-Promos.logo.9.png"
 *              },
 *              {
 *                  "id": 6,
 *                  "name": "Call of Legends Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Call-of-Legends.logo.33.png"
 *              },
 *              {
 *                  "id": 7,
 *                  "name": "HeartGold SoulSilver Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/HeartGold-SoulSilver.logo.34.png"
 *              },
 *              {
 *                  "id": 8,
 *                  "name": "Platinum Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Platinum.logo.38.png"
 *              },
 *              {
 *                  "id": 9,
 *                  "name": "Nintendo Promos Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Nintendo-Promos.logo.50.png"
 *              },
 *              {
 *                  "id": 10,
 *                  "name": "Diamond & Pearl Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Diamond-Pearl.logo.42.png"
 *              },
 *              {
 *                  "id": 11,
 *                  "name": "EX Ruby & Sapphire Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Ruby-Sapphire.logo.49.png"
 *              },
 *              {
 *                  "id": 12,
 *                  "name": "e-Card Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/e-Card.logo.108.png"
 *              },
 *              {
 *                  "id": 13,
 *                  "name": "Legendary Collection Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Legendary-Collection.logo.112.png"
 *              },
 *              {
 *                  "id": 14,
 *                  "name": "Neo Genesis Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Neo-Genesis.logo.113.png"
 *              },
 *              {
 *                  "id": 15,
 *                  "name": "Gym Heroes Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Gym-Heroes.logo.117.png"
 *              },
 *              {
 *                  "id": 16,
 *                  "name": "Base Set Series",
 *                  "image_path": "https://den-media.pokellector.com/logos/Base-Set.logo.119.png"
 *              },
 *          ]
 *      }
 */
