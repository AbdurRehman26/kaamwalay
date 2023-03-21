/**
 * @api {get} /v3/admin/orders/{orderId}/grades Get Cards Grade Values
 * @apiName Get Grade Values
 * @apiGroup Order Cards
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[order_item_id]] To return only desired item in response, used for revise flow. E.g. filter[order_item_id]=1
 * @apiParam {Array} [per_page] For pagination, indicates the amount of results desired per page. Default is 24. E.g. per_page=10
 * @apiParam {Array} [page] For pagination, indicates the page number to be returned. E.g. page=2
 *
 * @apiSuccess {Object} data UserCardResource
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "data": [
 *         {
 *             "id": 26,
 *             "customer": {
 *                 "id": 1,
 *                 "customer_number": "thdJr5lLEb",
 *                 "first_name": "Lorem",
 *                 "last_name": "Ipsum",
 *                 "email": "admin@robograding.com",
 *                 "phone": null
 *             },
 *             "order_item": {
 *                 "id": 499,
 *                 "order_id": 282,
 *                 "quantity": 1,
 *                 "declared_value_per_unit": 1,
 *                 "card_product": {
 *                     "id": 24,
 *                     "long_name": "2021 Pokemon Sword & Shield Series Battle Styles 24",
 *                     "short_name": "",
 *                     "name": "Pignite",
 *                     "card_category_name": "Pokemon",
 *                     "card_category_type": "TCG",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_date": "2021-03-19T00:00:00.000000Z",
 *                     "release_year": 2021,
 *                     "card_number_order": "024",
 *                     "image_path": "https://den-cards.pokellector.com/305/Pignite.SWSH05.24.37551.png",
 *                     "language": "English",
 *                     "variant": "",
 *                     "surface": "",
 *                     "edition": "",
 *                     "added_by_customer": false
 *                 },
 *                 "status": {
 *                     "id": 551,
 *                     "order_item_status": {
 *                         "id": 5,
 *                         "name": "Graded",
 *                         "description": "Item has been graded by us"
 *                     },
 *                     "notes": ""
 *                 },
 *                 "certificate_number": "00000757",
 *                 "user_card": {
 *                     "id": 26,
 *                     "card_product": {
 *                         "id": 24,
 *                         "long_name": "2021 Pokemon Sword & Shield Series Battle Styles 24",
 *                         "short_name": "",
 *                         "name": "Pignite",
 *                         "card_category_name": "Pokemon",
 *                         "card_category_type": "TCG",
 *                         "card_set_name": "Battle Styles",
 *                         "card_series_name": "Sword & Shield Series",
 *                         "release_date": "2021-03-19T00:00:00.000000Z",
 *                         "release_year": 2021,
 *                         "card_number_order": "024",
 *                         "image_path": "https://den-cards.pokellector.com/305/Pignite.SWSH05.24.37551.png",
 *                         "language": "English",
 *                         "variant": "",
 *                         "surface": "",
 *                         "edition": "",
 *                         "added_by_customer": false
 *                     },
 *                     "certificate_number": "00000757",
 *                     "order_number": "RG000000282",
 *                     "order_id": 282,
 *                     "overall_values": {
 *                         "edge": 4.6,
 *                         "center": 2.6,
 *                         "corner": 5.6,
 *                         "surface": 3.6
 *                     },
 *                     "human_grade_values": {
 *                         "back": {
 *                             "edge": "7",
 *                             "center": "5",
 *                             "corner": "8",
 *                             "surface": "6"
 *                         },
 *                         "front": {
 *                             "edge": "3",
 *                             "center": "1",
 *                             "corner": "4",
 *                             "surface": "2"
 *                         }
 *                     },
 *                     "generated_images": [
 *                         {
 *                             "name": "Front Centering",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Front Surface",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Front Edges",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Front Corners",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Back Centering",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Back Surface",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Back Edges",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Back Corners",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Front Centering",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Front Surface",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Front Edges",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Front Corners",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Back Centering",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Back Surface",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Back Edges",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Back Corners",
 *                             "output_image": null
 *                         }
 *                     ],
 *                     "overall_grade": 4,
 *                     "overall_grade_nickname": "VG-EX",
 *                     "notes": null,
 *                     "submitted_at": "2022-09-26T16:11:42.000000Z"
 *                 },
 *                 "graded_by": "Lorem Ipsum",
 *                 "graded_at": "2022-09-26T16:13:14.000000Z",
 *                 "notes": "",
 *                 "internal_notes": ""
 *             },
 *             "human_grade_values": {
 *                 "back": {
 *                     "edge": "7",
 *                     "center": "5",
 *                     "corner": "8",
 *                     "surface": "6"
 *                 },
 *                 "front": {
 *                     "edge": "3",
 *                     "center": "1",
 *                     "corner": "4",
 *                     "surface": "2"
 *                 }
 *             },
 *             "robo_grade_values": {
 *                 "back": null,
 *                 "front": null
 *             },
 *             "overall_values": {
 *                 "edge": 4.6,
 *                 "center": 2.6,
 *                 "corner": 5.6,
 *                 "surface": 3.6
 *             },
 *             "grade": {
 *                 "grade": 4,
 *                 "nickname": "VG-EX"
 *             },
 *             "grade_delta": 0,
 *             "grading_id": "9d5d2842-071b-4985-ba69-32ef9e556bcc",
 *             "ai_model_numbers": null,
 *             "generated_images": [
 *                 {
 *                     "name": "Front Centering",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Front Surface",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Front Edges",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Front Corners",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Back Centering",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Back Surface",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Back Edges",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Back Corners",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Front Centering",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Front Surface",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Front Edges",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Front Corners",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Back Centering",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Back Surface",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Back Edges",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Back Corners",
 *                     "output_image": null
 *                 }
 *             ],
 *             "updated_at": "2022-09-28T19:37:12.000000Z",
 *             "order": {
 *                 "auto_saved_at": "2022-09-26T16:16:07.000000Z",
 *                 "total_graded_items": 4
 *             }
 *         },
 *         {
 *             "id": 27,
 *             "customer": {
 *                 "id": 1,
 *                 "customer_number": "thdJr5lLEb",
 *                 "first_name": "Lorem",
 *                 "last_name": "Ipsum",
 *                 "email": "admin@robograding.com",
 *                 "phone": null
 *             },
 *             "order_item": {
 *                 "id": 500,
 *                 "order_id": 282,
 *                 "quantity": 1,
 *                 "declared_value_per_unit": 1,
 *                 "card_product": {
 *                     "id": 10,
 *                     "long_name": "2021 Pokemon Sword & Shield Series Battle Styles 10",
 *                     "short_name": "",
 *                     "name": "Durant",
 *                     "card_category_name": "Pokemon",
 *                     "card_category_type": "TCG",
 *                     "card_set_name": "Battle Styles",
 *                     "card_series_name": "Sword & Shield Series",
 *                     "release_date": "2021-03-19T00:00:00.000000Z",
 *                     "release_year": 2021,
 *                     "card_number_order": "010",
 *                     "image_path": "https://den-cards.pokellector.com/305/Durant.SWSH05.10.37537.png",
 *                     "language": "English",
 *                     "variant": "",
 *                     "surface": "",
 *                     "edition": "",
 *                     "added_by_customer": false
 *                 },
 *                 "status": {
 *                     "id": 552,
 *                     "order_item_status": {
 *                         "id": 5,
 *                         "name": "Graded",
 *                         "description": "Item has been graded by us"
 *                     },
 *                     "notes": ""
 *                 },
 *                 "certificate_number": "00000758",
 *                 "user_card": {
 *                     "id": 27,
 *                     "card_product": {
 *                         "id": 10,
 *                         "long_name": "2021 Pokemon Sword & Shield Series Battle Styles 10",
 *                         "short_name": "",
 *                         "name": "Durant",
 *                         "card_category_name": "Pokemon",
 *                         "card_category_type": "TCG",
 *                         "card_set_name": "Battle Styles",
 *                         "card_series_name": "Sword & Shield Series",
 *                         "release_date": "2021-03-19T00:00:00.000000Z",
 *                         "release_year": 2021,
 *                         "card_number_order": "010",
 *                         "image_path": "https://den-cards.pokellector.com/305/Durant.SWSH05.10.37537.png",
 *                         "language": "English",
 *                         "variant": "",
 *                         "surface": "",
 *                         "edition": "",
 *                         "added_by_customer": false
 *                     },
 *                     "certificate_number": "00000758",
 *                     "order_number": "RG000000282",
 *                     "order_id": 282,
 *                     "overall_values": {
 *                         "edge": 5.4,
 *                         "center": 7.4,
 *                         "corner": 4.4,
 *                         "surface": 6.4
 *                     },
 *                     "human_grade_values": {
 *                         "back": {
 *                             "edge": "3",
 *                             "center": "5",
 *                             "corner": "2",
 *                             "surface": "4"
 *                         },
 *                         "front": {
 *                             "edge": "7",
 *                             "center": "9",
 *                             "corner": "6",
 *                             "surface": "8"
 *                         }
 *                     },
 *                     "generated_images": [
 *                         {
 *                             "name": "Front Centering",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Front Surface",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Front Edges",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Front Corners",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Back Centering",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Back Surface",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Back Edges",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Back Corners",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Front Centering",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Front Surface",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Front Edges",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Front Corners",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Back Centering",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Back Surface",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Back Edges",
 *                             "output_image": null
 *                         },
 *                         {
 *                             "name": "Laser Back Corners",
 *                             "output_image": null
 *                         }
 *                     ],
 *                     "overall_grade": 6,
 *                     "overall_grade_nickname": "EX-MT",
 *                     "notes": null,
 *                     "submitted_at": "2022-09-26T16:11:42.000000Z"
 *                 },
 *                 "graded_by": "Lorem Ipsum",
 *                 "graded_at": "2022-09-26T16:13:44.000000Z",
 *                 "notes": "",
 *                 "internal_notes": ""
 *             },
 *             "human_grade_values": {
 *                 "back": {
 *                     "edge": "3",
 *                     "center": "5",
 *                     "corner": "2",
 *                     "surface": "4"
 *                 },
 *                 "front": {
 *                     "edge": "7",
 *                     "center": "9",
 *                     "corner": "6",
 *                     "surface": "8"
 *                 }
 *             },
 *             "robo_grade_values": {
 *                 "back": null,
 *                 "front": null
 *             },
 *             "overall_values": {
 *                 "edge": 5.4,
 *                 "center": 7.4,
 *                 "corner": 4.4,
 *                 "surface": 6.4
 *             },
 *             "grade": {
 *                 "grade": 6,
 *                 "nickname": "EX-MT"
 *             },
 *             "grade_delta": 0,
 *             "grading_id": "ef7b007e-644f-4b02-a76a-2c063f505854",
 *             "ai_model_numbers": null,
 *             "generated_images": [
 *                 {
 *                     "name": "Front Centering",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Front Surface",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Front Edges",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Front Corners",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Back Centering",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Back Surface",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Back Edges",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Back Corners",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Front Centering",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Front Surface",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Front Edges",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Front Corners",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Back Centering",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Back Surface",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Back Edges",
 *                     "output_image": null
 *                 },
 *                 {
 *                     "name": "Laser Back Corners",
 *                     "output_image": null
 *                 }
 *             ],
 *             "updated_at": "2022-09-28T19:37:12.000000Z",
 *             "order": {
 *                 "auto_saved_at": "2022-09-26T16:16:07.000000Z",
 *                 "total_graded_items": 4
 *             }
 *         }
 *     ],
 *     "links": {
 *         "first": "http://robograding.test/api/v3/admin/orders/282/grades?page=1",
 *         "last": "http://robograding.test/api/v3/admin/orders/282/grades?page=3",
 *         "prev": null,
 *         "next": "http://robograding.test/api/v3/admin/orders/282/grades?page=2"
 *     },
 *     "meta": {
 *         "current_page": 1,
 *         "from": 1,
 *         "last_page": 3,
 *         "links": [
 *             {
 *                 "url": null,
 *                 "label": "&laquo; Previous",
 *                 "active": false
 *             },
 *             {
 *                 "url": "http://robograding.test/api/v3/admin/orders/282/grades?page=1",
 *                 "label": "1",
 *                 "active": true
 *             },
 *             {
 *                 "url": "http://robograding.test/api/v3/admin/orders/282/grades?page=2",
 *                 "label": "2",
 *                 "active": false
 *             },
 *             {
 *                 "url": "http://robograding.test/api/v3/admin/orders/282/grades?page=3",
 *                 "label": "3",
 *                 "active": false
 *             },
 *             {
 *                 "url": "http://robograding.test/api/v3/admin/orders/282/grades?page=2",
 *                 "label": "Next &raquo;",
 *                 "active": false
 *             }
 *         ],
 *         "path": "http://robograding.test/api/v3/admin/orders/282/grades",
 *         "per_page": 2,
 *         "to": 2,
 *         "total": 5
 *     }
 * }
 */
