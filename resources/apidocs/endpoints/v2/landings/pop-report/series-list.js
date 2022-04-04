/**
 * @api {get} /v2/pop/categories/{category_id}?per_page=2&page=1 List Series POP Reports
 * @apiName List Series POP Report
 * @apiGroup Pop Report
 *
 * @apiVersion 2.0.0
 *
 * @apiParam {Integer} category_id Unique category id associated to series
 * @apiParam {Integer} per_page Number of results to return
 * @apiParam {Integer} page Page number for navigation
 * *
 * @apiSuccess {Object} data POP Series data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "data": [
 *               {
 *                   "id": 1,
 *                   "card_series_id": 1,
 *                   "pr": 0,
 *                   "fr": 0,
 *                   "good": 0,
 *                   "good_plus": 0,
 *                   "vg": 0,
 *                   "vg_plus": 0,
 *                   "vg_ex": 0,
 *                   "vg_ex_plus": 0,
 *                   "ex": 0,
 *                   "ex_plus": 0,
 *                   "ex_mt": 0,
 *                   "ex_mt_plus": 0,
 *                   "nm": 0,
 *                   "nm_plus": 0,
 *                   "nm_mt": 0,
 *                   "nm_mt_plus": 0,
 *                   "mint": 0,
 *                   "mint_plus": 0,
 *                   "gem_mt": 0,
 *                   "total": 0,
 *                   "total_plus": 0,
 *                   "name": "Sword & Shield Series",
 *                   "image_path": "https://den-media.pokellector.com/logos/Sword-Shield.logo.286.png",
 *                   "release_date": "2019-11-15 00:00:00"
 *               },
 *               {
 *                   "id": 2,
 *                   "card_series_id": 2,
 *                   "pr": 0,
 *                   "fr": 0,
 *                   "good": 0,
 *                   "good_plus": 0,
 *                   "vg": 0,
 *                   "vg_plus": 0,
 *                   "vg_ex": 0,
 *                   "vg_ex_plus": 0,
 *                   "ex": 0,
 *                   "ex_plus": 0,
 *                   "ex_mt": 0,
 *                   "ex_mt_plus": 0,
 *                   "nm": 0,
 *                   "nm_plus": 0,
 *                   "nm_mt": 0,
 *                   "nm_mt_plus": 0,
 *                   "mint": 0,
 *                   "mint_plus": 0,
 *                   "gem_mt": 0,
 *                   "total": 0,
 *                   "total_plus": 0,
 *                   "name": "Sun & Moon Series",
 *                   "image_path": "https://den-media.pokellector.com/logos/Sun-Moon.logo.205.png",
 *                   "release_date": "2016-11-18 00:00:00"
 *               }
 *           ],
 *           "links": {
 *               "first": "http://robograding.test/api/v2/pop/categories/1?page=1",
 *               "last": "http://robograding.test/api/v2/pop/categories/1?page=9",
 *               "prev": null,
 *               "next": "http://robograding.test/api/v2/pop/categories/1?page=2"
 *           },
 *           "meta": {
 *               "current_page": 1,
 *               "from": 1,
 *               "last_page": 9,
 *               "links": [
 *                   {
 *                       "url": null,
 *                       "label": "&laquo; Previous",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=1",
 *                       "label": "1",
 *                       "active": true
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=2",
 *                       "label": "2",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=3",
 *                       "label": "3",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=4",
 *                       "label": "4",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=5",
 *                       "label": "5",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=6",
 *                       "label": "6",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=7",
 *                       "label": "7",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=8",
 *                       "label": "8",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=9",
 *                       "label": "9",
 *                       "active": false
 *                   },
 *                   {
 *                       "url": "http://robograding.test/api/v2/pop/categories/1?page=2",
 *                       "label": "Next &raquo;",
 *                       "active": false
 *                   }
 *               ],
 *               "path": "http://robograding.test/api/v2/pop/categories/1",
 *               "per_page": 2,
 *               "to": 2,
 *               "total": 18
 *           },
 *           "total_population": {
 *               "pr": "0",
 *               "fr": "0",
 *               "good": "0",
 *               "good_plus": "0",
 *               "vg": "0",
 *               "vg_plus": "0",
 *               "vg_ex": "0",
 *               "vg_ex_plus": "0",
 *               "ex": "0",
 *               "ex_plus": "0",
 *               "ex_mt": "0",
 *               "ex_mt_plus": "0",
 *               "nm": "0",
 *               "nm_plus": "0",
 *               "nm_mt": "0",
 *               "nm_mt_plus": "0",
 *               "mint": "0",
 *               "mint_plus": "0",
 *               "gem_mt": "0",
 *               "total": "0",
 *               "total_plus": "0"
 *           },
 *           "card_category": {
 *               "id": 1,
 *               "name": "Pokemon",
 *               "image_url": "https://robograding-live.s3.us-west-2.amazonaws.com/platform/categories/Pokemon.png"
 *           }
 *       }
 */
