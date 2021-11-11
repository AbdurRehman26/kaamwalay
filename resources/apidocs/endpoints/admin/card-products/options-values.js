/**
 * @api {get} /admin/cards/options Get Card Creation Dropdowns Options
 * @apiName Get Card Creation Dropdowns Options
 * @apiGroup Admin Card Products
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Dropdowns options data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *          {
 *              "category": {
 *                  "1": "Pokemon"
 *              },
 *              "rarity": [
 *                  "Common",
 *                  "Uncommon",
 *                  "Rare"
 *              ],
 *              "edition": [
 *                  "1st Edition",
 *                  "Shadowless",
 *                  "Unlimited"
 *              ],
 *              "surface": [
 *                  "Holo",
 *                  "Cracked Ice Holo",
 *                  "Cosmos Holo",
 *                  "Reverse Holo",
 *                  "Reverse Foil"
 *              ],
 *              "language": [
 *                  "Japanese",
 *                  "English",
 *                  "Dutch",
 *                  "German",
 *                  "French",
 *                  "Italian",
 *                  "Spanish",
 *                  "Portuguese",
 *                  "(South) Korean",
 *                  "Traditional Chinese",
 *                  "Russian",
 *                  "Polish"
 *              ],
 *              "series": [
 *                    {
 *                        "id": 1,
 *                        "name": "Sword & Shield Series",
 *                        "image_path": "https://den-media.pokellector.com/logos/Sword-Shield.logo.286.png",
 *                        "card_sets": [
 *                            {
 *                                "id": 1,
 *                                "card_series_id": 1,
 *                                "name": "Battle Styles",
 *                                "image_path": "https://den-media.pokellector.com/logos/Battle-Styles.logo.305.png",
 *                                "release_date": "2021-03-19T00:00:00.000000Z"
 *                            },
 *                            {
 *                                "id": 2,
 *                                "card_series_id": 1,
 *                                "name": "Shining Fates",
 *                                "image_path": "https://den-media.pokellector.com/logos/Shining-Fates.logo.304.png",
 *                                "release_date": "2021-02-19T00:00:00.000000Z"
 *                            },
 *                            {
 *                                "id": 3,
 *                                "card_series_id": 1,
 *                                "name": "McDonald's 25th Anniversary",
 *                                "image_path": "https://den-media.pokellector.com/logos/McDonalds-25th-Anniversary.logo.300.png",
 *                                "release_date": "2021-02-09T00:00:00.000000Z"
 *                            },
 *                            {
 *                                "id": 4,
 *                                "card_series_id": 1,
 *                                "name": "Vivid Voltage",
 *                                "image_path": "https://den-media.pokellector.com/logos/Vivid-Voltage.logo.299.png",
 *                                "release_date": "2020-11-13T00:00:00.000000Z"
 *                            }
 *                        ]
 *                    },
 *                    {
 *                        "id": 2,
 *                        "name": "Sun & Moon Series",
 *                        "image_path": "https://den-media.pokellector.com/logos/Sun-Moon.logo.205.png",
 *                        "card_sets": [
 *                            {
 *                                "id": 11,
 *                                "card_series_id": 2,
 *                                "name": "Cosmic Eclipse",
 *                                "image_path": "https://den-media.pokellector.com/logos/Cosmic-Eclipse.logo.280.png",
 *                                "release_date": "2019-11-01T00:00:00.000000Z"
 *                            },
 *                            {
 *                                "id": 12,
 *                                "card_series_id": 2,
 *                                "name": "McDonald's Collection (2019)",
 *                                "image_path": "https://den-media.pokellector.com/logos/McDonalds-Collection-2019.logo.290.png",
 *                                "release_date": "2019-10-15T00:00:00.000000Z"
 *                            },
 *                            {
 *                                "id": 13,
 *                                "card_series_id": 2,
 *                                "name": "Hidden Fates",
 *                                "image_path": "https://den-media.pokellector.com/logos/Hidden-Fates.logo.279.png",
 *                                "release_date": "2019-08-23T00:00:00.000000Z"
 *                            },
 *                            {
 *                                "id": 14,
 *                                "card_series_id": 2,
 *                                "name": "Unified Minds",
 *                                "image_path": "https://den-media.pokellector.com/logos/Unified-Minds.logo.275.png",
 *                                "release_date": "2019-08-02T00:00:00.000000Z"
 *                            }
 *                        ]
 *                    }
 *                ]
 *          }
 */
