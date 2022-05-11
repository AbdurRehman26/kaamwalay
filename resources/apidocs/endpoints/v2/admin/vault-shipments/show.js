/**
 * @api {get} /v2/admin/vault-shipments/1 Show Vault Shipment
 * @apiName Show Vault Shipment
 * @apiGroup Admin Vault Shipment
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [include] For including relationships [user, vaultShipmentStatus, billingAddress, shippingAddress, vaultShipmentItems, shippingMethod, vaultShipmentPayments]
 * @apiSuccess {Object} data Vault data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "data": {
 *                  "id": 1,
 *                  "shipment_number": "931601d2-c834-362d-af68-e8a4eefdc70e",
 *                  "created_at": "2022-04-08T17:04:31.000000Z",
 *                  "shipped_at": null,
 *                  "customer": {
 *                      "id": 1,
 *                      "customer_number": "sHlFSQ6zg9",
 *                      "first_name": "Carlos",
 *                      "last_name": "Morales",
 *                      "email": "admin@robograding.com",
 *                      "phone": null
 *                  },
 *                  "status": {
 *                      "id": 2,
 *                      "code": "2",
 *                      "name": "SHIPPED",
 *                      "description": "Alias consequatur doloremque ut consequatur dolores. Exercitationem nihil quod ipsum praesentium in quas. Voluptas quos delectus impedit magni quam quia."
 *                  },
 *                  "billing_address": {
 *                      "id": 56,
 *                      "first_name": "Isobel",
 *                      "last_name": "Gaylord",
 *                      "address": "9670 Mohammad Extension Suite 291\nAbshirefurt, AK 72546",
 *                      "city": "East Amira",
 *                      "state": "assumenda",
 *                      "zip": "13169",
 *                      "phone": "781-923-5848",
 *                      "flat": "10",
 *                      "country": {
 *                          "id": 63,
 *                          "code": "CI",
 *                          "name": "Cape Verde"
 *                      }
 *                  },
 *                  "shipping_address": {
 *                      "id": 55,
 *                      "first_name": "Kraig",
 *                      "last_name": "Bartoletti",
 *                      "address": "8138 Nico Overpass\nPort Colten, TX 11851-4996",
 *                      "city": "West Americoberg",
 *                      "state": "quaerat",
 *                      "zip": "05746-4917",
 *                      "phone": "1-540-610-2918",
 *                      "flat": "3",
 *                      "country": {
 *                          "id": 62,
 *                          "code": "AG",
 *                          "name": "Portugal"
 *                      }
 *                  },
 *                  "vault_shipment_item": [
 *                      {
 *                          "user_card": {
 *                        "id": 1,
 *                        "card_product": {
 *                            "id": 106,
 *                            "long_name": "2001 Rupert Harrison Domenick 354",
 *                            "short_name": "1st Edition - Reverse Holo - Next Destinies Stage 1 Blisters",
 *                            "name": "Unique",
 *                            "card_category_name": "Rupert",
 *                            "card_set_name": "Domenick",
 *                            "card_series_name": "Harrison",
 *                            "release_date": "1999-09-22T00:00:00.000000Z",
 *                            "release_year": 2001,
 *                            "card_number_order": "354",
 *                            "image_path": "https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png",
 *                            "language": "English",
 *                            "variant": "Next Destinies Stage 1 Blisters",
 *                            "surface": "Reverse Holo",
 *                            "edition": "1st Edition",
 *                            "added_by_customer": false
 *                        },
 *                        "certificate_number": null,
 *                        "order_number": "70cde2c8-30fd-388e-98e1-a771d3d2f7d0",
 *                        "order_id": 15,
 *                        "overall_values": {
 *                            "edge": 9,
 *                            "center": 6.6,
 *                            "corner": 8.4,
 *                            "surface": 9
 *                        },
 *                        "human_grade_values": {
 *                            "back": {
 *                                "edge": "9",
 *                                "center": "3",
 *                                "corner": "9",
 *                                "surface": "9"
 *                            },
 *                            "front": {
 *                                "edge": "9",
 *                                "center": "9",
 *                                "corner": "8",
 *                                "surface": "9"
 *                            }
 *                        },
 *                        "generated_images": [
 *                            {
 *                                "name": "Front Centering",
 *                                "output_image": null
 *                            },
 *                            {
 *                                "name": "Front Surface",
 *                                "output_image": null
 *                            },
 *                            {
 *                                "name": "Front Edges",
 *                                "output_image": null
 *                            },
 *                            {
 *                                "name": "Front Corners",
 *                                "output_image": null
 *                            },
 *                            {
 *                                "name": "Back Centering",
 *                                "output_image": null
 *                            },
 *                            {
 *                                "name": "Back Surface",
 *                                "output_image": null
 *                            },
 *                            {
 *                                "name": "Back Edges",
 *                                "output_image": null
 *                            },
 *                            {
 *                                "name": "Back Corners",
 *                                "output_image": null
 *                            }
 *                        ],
 *                        "overall_grade": null,
 *                        "overall_grade_nickname": null,
 *                        "notes": null,
 *                        "submitted_at": "2022-04-08T17:04:32.000000Z"
 *                          }
 *                      }
 *                  ],
 *                  "shipping_method": {
 *                      "id": 27,
 *                      "code": "quae",
 *                      "name": "Maggie"
 *                  },
 *                  "cards_number": 1,
 *                  "tracking_number": "1199009900",
 *                  "shipping_provider": "a",
 *                  "tracking_url": null
 *              }
 *       }
 */
