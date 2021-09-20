/**
 * @api {get} /admin/orders/1/grades Get Cards Grade Values
 * @apiName Get Grade Values
 * @apiGroup Order Cards
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data UserCardResource
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "data": [
 *             {
 *                 "id": 1,
 *                 "customer": {
 *                     "id": 17,
 *                     "first_name": "John",
 *                     "last_name": "Doe",
 *                     "email": "john.doe@wooter.com",
 *                     "phone": null
 *                 },
 *                 "order_item": {
 *                     "id": 134,
 *                     "quantity": 1,
 *                     "declared_value_per_unit": 1,
 *                     "card_product": {
 *                         "id": 1,
 *                         "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 1 Bellsprout",
 *                         "name": "Bellsprout",
 *                         "card_category_name": "Pokemon",
 *                         "card_set_name": "Battle Styles",
 *                         "card_series_name": "Sword & Shield Series",
 *                         "release_year": 2021,
 *                         "card_number_order": "001",
 *                         "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                     },
 *                     "status": {
 *                         "id": 5,
 *                         "order_item_status": {
 *                             "id": 4,
 *                             "name": "Confirmed",
 *                             "description": "Item is present in the shipped box and will be graded"
 *                         },
 *                         "notes": ""
 *                     },
 *                     "certificate_number": "00000501"
 *                 },
 *                 "human_grade_values": {
 *                     "back": {
 *                         "edge": 0,
 *                         "center": 0,
 *                         "corner": 0,
 *                         "surface": 0
 *                     },
 *                     "front": {
 *                         "edge": 0,
 *                         "center": 0,
 *                         "corner": 0,
 *                         "surface": 0
 *                     }
 *                 },
 *                 "robo_grade_values": {
 *                     "front": {
 *                         "center": "2.00",
 *                         "surface": "10.00",
 *                         "edge": "6.00",
 *                         "corner": "8.00"
 *                     },
 *                     "back": {
 *                         "center": "2.00",
 *                         "surface": "10.00",
 *                         "edge": "5.00",
 *                         "corner": "10.00"
 *                     }
 *                 },
 *                 "overall_values": {
 *                     "edge": 0,
 *                     "center": 0,
 *                     "corner": 0,
 *                     "surface": 0
 *                 },
 *                 "grade": {
 *                     "grade": 0,
 *                     "nickname": null
 *                 },
 *                 "grading_id": "a099624b-ec8b-483d-afe2-201b452508d4",
 *                 "ai_model_numbers": null,
 *                 "generated_images": [
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/centering/centering_front_pidgey2_07h41ZN.jpg",
 *                         "name": "Front Centering"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/surface/surface_front_pidgey2_xUnfJNc.jpg",
 *                         "name": "Front Surface"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/edges/edges_front_pidgey2_lktKWqh.jpg",
 *                         "name": "Front Edges"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/corners/corners_front_pidgey2_iEnWezi.jpg",
 *                         "name": "Front Corners"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/centering/centering_back_pidgey2_0044l8C.jpg",
 *                         "name": "Back Centering"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/surface/surface_back_pidgey2_jeHy6fS.jpg",
 *                         "name": "Back Surface"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/edges/edges_back_pidgey2_eQTE3c6.jpg",
 *                         "name": "Back Edges"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/corners/corners_back_pidgey2_Kxk1MVo.jpg",
 *                         "name": "Back Corners"
 *                     }
 *                 ],
 *                 "updated_at": "2021-09-14T01:30:17.000000Z"
 *             },
 *             {
 *                 "id": 1,
 *                 "customer": {
 *                     "id": 17,
 *                     "first_name": "John",
 *                     "last_name": "Doe",
 *                     "email": "john.doe@wooter.com",
 *                     "phone": null
 *                 },
 *                 "order_item": {
 *                     "id": 134,
 *                     "quantity": 1,
 *                     "declared_value_per_unit": 1,
 *                     "card_product": {
 *                         "id": 1,
 *                         "full_name": "2021 Pokemon Sword & Shield Series Battle Styles 1 Bellsprout",
 *                         "name": "Bellsprout",
 *                         "card_category_name": "Pokemon",
 *                         "card_set_name": "Battle Styles",
 *                         "card_series_name": "Sword & Shield Series",
 *                         "release_year": 2021,
 *                         "card_number_order": "001",
 *                         "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png"
 *                     },
 *                     "status": {
 *                         "id": 4,
 *                         "name": "Confirmed",
 *                         "description": "Item is present in the shipped box and will be graded"
 *                     },
 *                     "certificate_number": "00000501"
 *                 },
 *                 "human_grade_values": {
 *                     "back": {
 *                         "edge": 0,
 *                         "center": 0,
 *                         "corner": 0,
 *                         "surface": 0
 *                     },
 *                     "front": {
 *                         "edge": 0,
 *                         "center": 0,
 *                         "corner": 0,
 *                         "surface": 0
 *                     }
 *                 },
 *                 "robo_grade_values": {
 *                     "front": {
 *                         "center": "2.00",
 *                         "surface": "10.00",
 *                         "edge": "6.00",
 *                         "corner": "8.00"
 *                     },
 *                     "back": {
 *                         "center": "2.00",
 *                         "surface": "10.00",
 *                         "edge": "5.00",
 *                         "corner": "10.00"
 *                     }
 *                 },
 *                 "overall_values": {
 *                     "edge": 0,
 *                     "center": 0,
 *                     "corner": 0,
 *                     "surface": 0
 *                 },
 *                 "grade": {
 *                     "grade": 0,
 *                     "nickname": null
 *                 },
 *                 "grading_id": "a099624b-ec8b-483d-afe2-201b452508d4",
 *                 "ai_model_numbers": null,
 *                 "generated_images": [
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/centering/centering_front_pidgey2_07h41ZN.jpg",
 *                         "name": "Front Centering"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/surface/surface_front_pidgey2_xUnfJNc.jpg",
 *                         "name": "Front Surface"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/edges/edges_front_pidgey2_lktKWqh.jpg",
 *                         "name": "Front Edges"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/corners/corners_front_pidgey2_iEnWezi.jpg",
 *                         "name": "Front Corners"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/centering/centering_back_pidgey2_0044l8C.jpg",
 *                         "name": "Back Centering"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/surface/surface_back_pidgey2_jeHy6fS.jpg",
 *                         "name": "Back Surface"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/edges/edges_back_pidgey2_eQTE3c6.jpg",
 *                         "name": "Back Edges"
 *                     },
 *                     {
 *                         "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/corners/corners_back_pidgey2_Kxk1MVo.jpg",
 *                         "name": "Back Corners"
 *                     }
 *                 ],
 *                 "updated_at": "2021-09-14T01:30:17.000000Z"
 *             }
 *         ]
 *     }
 */
