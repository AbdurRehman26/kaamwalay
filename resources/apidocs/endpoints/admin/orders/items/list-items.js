/**
 * @api {get} /admin/orders/17/items List order items
 * @apiName List order Items
 * @apiGroup Order Cards
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Card object & Order object
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": [
 *               {
 *                   "id": 20,
 *                   "order_id": 17,
 *                   "quantity": 1,
 *                   "declared_value_per_unit": 3,
 *                   "card_product": {
 *                       "id": 102,
 *                       "full_name": "1973 Keely Claire Kayli 233 Oleta",
 *                       "name": "Oleta",
 *                       "card_category_name": "Keely",
 *                       "card_set_name": "Kayli",
 *                       "card_series_name": "Claire",
 *                       "release_year": 1973,
 *                       "card_number_order": "233",
 *                       "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                   },
 *                  "status": {
 *                       "id": 15,
 *                        "order_item_status": {
 *                           "id": 1,
 *                           "name": "Pending",
 *                           "description": "Item is pending to be reviewed"
 *                        },
 *                       "notes": ""
 *                   },
 *                   "certificate_number": "00000501",
 *                   "user_card": {
 *                       "overall_grade": 0,
 *                      "overall_grade_nickname": null
 *                  }
 *               },
 *               {
 *                   "id": 98,
 *                   "order_id": 17,
 *                  "quantity": 1,
 *                   "declared_value_per_unit": 2,
 *                   "card_product": {
 *                       "id": 101,
 *                       "full_name": "1991 Vincenzo Patsy Felipe 216 Nicole",
 *                       "name": "Nicole",
 *                       "card_category_name": "Vincenzo",
 *                       "card_set_name": "Felipe",
 *                       "card_series_name": "Patsy",
 *                       "release_year": 1991,
 *                       "card_number_order": "216",
 *                       "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                   },
 *                   "status": {
 *                       "id": 195,
 *                       "order_item_status": {
 *                          "id": 4,
 *                           "name": "Confirmed",
 *                           "description": "Item is present in the shipped box and will be graded"
 *                       },
 *                       "notes": ""
 *                   },
 *                   "certificate_number": "00000579",
 *                   "user_card": {
 *                       "overall_grade": 0,
 *                       "overall_grade_nickname": null
 *                   }
 *               }
 *           ],
 *           "order": {
 *               "id": 17,
 *               "order_number": "RG000000017"
 *           }
 *      }
 */
