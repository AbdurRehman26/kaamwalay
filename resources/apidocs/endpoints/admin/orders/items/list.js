/**
 * @api {get} /admin/orders/13/cards Get Order Cards
 * @apiName Order Cards
 * @apiGroup Order Cards
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Order Cards data
 * @apiSuccess {Object} order Order data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": [
 *             {
 *                 "id": 11,
 *                 "quantity": 1,
 *                 "declared_value_per_unit": 15,
 *                 "card_product": {
 *                     "id": 1,
 *                     "name": "Bellsprout",
 *                     "card_category_name": "Pokemon",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_year": 2021,
 *                     "card_number_order": "001",
 *                     "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                 },
 *                 "status": {
 *                     "id": 13,
 *                     "order_item_status": {
 *                         "id": 1,
 *                         "code": "pending",
 *                         "name": "Pending",
 *                         "description": "Item is pending to be reviewed",
 *                         "created_at": "2021-09-04T21:12:34.000000Z",
 *                         "updated_at": "2021-09-04T21:12:34.000000Z"
 *                     },
 *                     "notes": null
 *                 },
 *                 "certificate_number": null
 *             },
 *             {
 *                 "id": 89,
 *                 "quantity": 1,
 *                 "declared_value_per_unit": 0,
 *                 "card_product": {
 *                     "id": 75,
 *                     "name": "Conkeldurr",
 *                     "card_category_name": "Pokemon",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_year": 2021,
 *                     "card_number_order": "075",
 *                     "image_path": "https://den-cards.pokellector.com/305/Conkeldurr.SWSH05.75.37599.png"
 *                 },
 *                 "status": {
 *                     "id": 91,
 *                     "order_item_status": {
 *                         "id": 1,
 *                         "code": "pending",
 *                         "name": "Pending",
 *                         "description": "Item is pending to be reviewed",
 *                         "created_at": "2021-09-04T21:12:34.000000Z",
 *                         "updated_at": "2021-09-04T21:12:34.000000Z"
 *                     },
 *                     "notes": null
 *                 },
 *                 "certificate_number": null
 *             },
 *             {
 *                 "id": 90,
 *                 "quantity": 1,
 *                 "declared_value_per_unit": 0,
 *                 "card_product": {
 *                     "id": 70,
 *                     "name": "Marowak",
 *                     "card_category_name": "Pokemon",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_year": 2021,
 *                     "card_number_order": "070",
 *                     "image_path": "https://den-cards.pokellector.com/305/Marowak.SWSH05.70.37594.png"
 *                 },
 *                 "status": {
 *                     "id": 92,
 *                     "order_item_status": {
 *                         "id": 1,
 *                         "code": "pending",
 *                         "name": "Pending",
 *                         "description": "Item is pending to be reviewed",
 *                         "created_at": "2021-09-04T21:12:34.000000Z",
 *                         "updated_at": "2021-09-04T21:12:34.000000Z"
 *                     },
 *                     "notes": null
 *                 },
 *                 "certificate_number": null
 *             }
 *         ],
 *         "order": {
 *             "id": 13,
 *             "order_number": "RG000000013"
 *         }
 *     }
 */
