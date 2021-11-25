/**
 * @api {get} /admin/cards/sets List Sets
 * @apiName List Sets
 * @apiGroup Admin Card Sets
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} series_id Unique series id associated to sets
 *
 * @apiSuccess {Object} data Card Sets data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": [
 *             {
 *                 "id": 1,
 *                 "name": "Battle Styles",
 *                 "release_date": "2021-03-19T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Battle-Styles.logo.305.png"
 *             },
 *             {
 *                 "id": 2,
 *                 "name": "Shining Fates",
 *                 "release_date": "2021-02-19T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Shining-Fates.logo.304.png"
 *             },
 *             {
 *                 "id": 3,
 *                 "name": "McDonald's 25th Anniversary",
 *                 "release_date": "2021-02-09T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/McDonalds-25th-Anniversary.logo.300.png"
 *             },
 *             {
 *                 "id": 4,
 *                 "name": "Vivid Voltage",
 *                 "release_date": "2020-11-13T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Vivid-Voltage.logo.299.png"
 *             },
 *             {
 *                 "id": 5,
 *                 "name": "Champion's Path",
 *                 "release_date": "2020-09-25T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Champions-Path.logo.298.png"
 *             },
 *             {
 *                 "id": 6,
 *                 "name": "Pokemon Futsal Promos",
 *                 "release_date": "2020-09-11T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Pokemon-Futsal-Promos.logo.303.png"
 *             },
 *             {
 *                 "id": 7,
 *                 "name": "Darkness Ablaze",
 *                 "release_date": "2020-08-14T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Darkness-Ablaze.logo.296.png"
 *             },
 *             {
 *                 "id": 8,
 *                 "name": "Rebel Clash",
 *                 "release_date": "2020-05-01T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Rebel-Clash.logo.292.png"
 *             },
 *             {
 *                 "id": 9,
 *                 "name": "Sword & Shield Promos",
 *                 "release_date": "2019-11-15T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Sword-Shield-Promos.logo.287.png"
 *             },
 *             {
 *                 "id": 10,
 *                 "name": "Sword & Shield",
 *                 "release_date": "2020-02-01T00:00:00.000000Z",
 *                 "image_path": "https://den-media.pokellector.com/logos/Sword-Shield.logo.286.png"
 *             }
 *         ]
 *     }
 */
