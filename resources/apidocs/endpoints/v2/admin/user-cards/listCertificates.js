/**
 * @api {get} /v2/admin/certificates List certificates
 * @apiName List Certificates
 * @apiGroup Admin Certificates
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {string} sort For sorting records, supporting params are [created_at, -created_at]. Default is created_at descending. E.g. sort=created_at
 *
 * @apiSuccess {Object} data Certificates data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "certificate_id": "00000506",
 *                  "grade": 8.5,
 *                  "nickname": "NM-MT+",
 *                  "card_name": "Durant",
 *                  "category_name": "Pokemon",
 *                  "set_name": "Battle Styles",
 *                  "set_cards_number": 163,
 *                  "series_name": "Sword & Shield Series",
 *                  "release_date": "2021-03-19T00:00:00.000000Z",
 *                  "release_year": 2021,
 *                  "card_number_order": "010",
 *                  "image_path": "https://den-cards.pokellector.com/305/Durant.SWSH05.10.37537.png",
 *                  "rarity": "Uncommon",
 *                  "language": "English",
 *                  "variant": "",
 *                  "surface": "",
 *                  "edition": ""
 *              },
 *              {
 *                  "certificate_id": "00000507",
 *                  "grade": 8,
 *                  "nickname": "NM-MT",
 *                  "card_name": "Durant",
 *                  "category_name": "Pokemon",
 *                  "set_name": "Battle Styles",
 *                  "set_cards_number": 163,
 *                  "series_name": "Sword & Shield Series",
 *                  "release_date": "2021-03-19T00:00:00.000000Z",
 *                  "release_year": 2021,
 *                  "card_number_order": "010",
 *                  "image_path": "https://den-cards.pokellector.com/305/Durant.SWSH05.10.37537.png",
 *                  "rarity": "Uncommon",
 *                  "language": "English",
 *                  "variant": "",
 *                  "surface": "",
 *                  "edition": ""
 *              },
 *              {
 *                  "certificate_id": "00000748",
 *                  "grade": 74,
 *                  "nickname": "NM",
 *                  "card_name": "Bruxish",
 *                  "category_name": "Pokemon",
 *                  "set_name": "Battle Styles",
 *                  "set_cards_number": 163,
 *                  "series_name": "Sword & Shield Series",
 *                  "release_date": "2021-03-19T00:00:00.000000Z",
 *                  "release_year": 2021,
 *                  "card_number_order": "043",
 *                  "image_path": "https://den-cards.pokellector.com/305/Bruxish.SWSH05.43.37567.png",
 *                  "rarity": "Uncommon",
 *                  "language": "English",
 *                  "variant": "",
 *                  "surface": "",
 *                  "edition": ""
 *              }
 *          ],
 *          "links": {
 *              "first": "http://robograding.test/api/v2/admin/certificates?page=1",
 *              "last": "http://robograding.test/api/v2/admin/certificates?page=1",
 *              "prev": null,
 *              "next": null
 *          },
 *          "meta": {
 *              "current_page": 1,
 *              "from": 1,
 *              "last_page": 1,
 *              "links": [
 *                  {
 *                      "url": null,
 *                      "label": "&laquo; Previous",
 *                      "active": false
 *                  },
 *                  {
 *                      "url": "http://robograding.test/api/v2/admin/certificates?page=1",
 *                      "label": "1",
 *                      "active": true
 *                  },
 *                  {
 *                      "url": null,
 *                      "label": "Next &raquo;",
 *                      "active": false
 *                  }
 *              ],
 *              "path": "http://robograding.test/api/v2/admin/certificates",
 *              "per_page": 10,
 *              "to": 8,
 *              "total": 8
 *          }
 *      }
 */
