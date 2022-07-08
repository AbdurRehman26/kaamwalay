/**
 * @api {get} /v2/admin/certificates/{certificateNumber} Show certificate
 * @apiName Show Certificate
 * @apiGroup Admin Certificates
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Certificate data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *         "data": {
 *              "certificate_number": "00000748",
 *              "grade": 74,
 *              "nickname": "NM",
 *              "card_name": "Bruxish",
 *              "category_name": "Pokemon",
 *              "set_name": "Battle Styles",
 *              "set_cards_number": 163,
 *              "series_name": "Sword & Shield Series",
 *              "release_date": "2021-03-19T00:00:00.000000Z",
 *              "release_year": 2021,
 *              "card_number_order": "043",
 *              "image_path": "https://den-cards.pokellector.com/305/Bruxish.SWSH05.43.37567.png",
 *              "rarity": "Uncommon",
 *              "language": "English",
 *              "variant": "",
 *              "surface": "",
 *              "edition": ""
 *          }
 */
