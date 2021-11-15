/**
 * @api {get} /customer/cards/1 Show Card
 * @apiName Show Card
 * @apiGroup User Cards
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Integer} customerId Unique customer id
 * @apiParam {Integer} userCardId Unique user card id
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": {
 *             "id": 4,
 *             "card_product": {
 *                 "id": 10,
 *                 "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 4 Cacnea",
 *                 "name": "Cacnea",
 *                 "card_category_name": "Pokemon",
 *                 "card_set_name": "Battle Styles",
 *                 "card_series_name": "Sword & Shield Series",
 *                 "release_date": "2021-10-04T20:21:00.000000Z",
 *                 "release_year": 2021,
 *                 "card_number_order": "004",
 *                 "image_path": "https://den-cards.pokellector.com/305/Cacnea.SWSH05.4.37531.png"
 *             },
 *             "certificate_number": "00000501",
 *             "order_number": "RG000000094",
 *             "order_id": 5,
 *             "overall_values": {
 *                 "edge": 0,
 *                 "center": 0,
 *                 "corner": 0,
 *                 "surface": 0
 *             },
 *             "human_grade_values": {
 *                 "back": {
 *                     "edge": "8.00",
 *                     "center": "2.00",
 *                     "corner": "10.00",
 *                     "surface": "10.00"
 *                 },
 *                 "front": {
 *                     "edge": "0.00",
 *                     "center": "0.00",
 *                     "corner": "0.00",
 *                     "surface": "0.00"
 *                 }
 *             },
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
 *             "overall_grade": 7,
 *             "overall_grade_nickname": "T",
 *             "submitted_at": {
 *                  "date": "2021-08-12 02:22:46.000000",
 *                  "timezone_type": 3,
 *                  "timezone": "UTC"
 *             }
 *         }
 *     }
 */