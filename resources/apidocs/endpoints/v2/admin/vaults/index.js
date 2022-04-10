/**
 * @api {get} /v2/admin/vauls List vaults
 * @apiName List Vaults
 * @apiGroup Admin Vaults
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[vault_shipment_status]] For filtering records by shipment status. E.g. filter[vault_shipment_status]=1
 * @apiParam {Array} [filter[order_status]] For filtering records by order status. E.g. filter[order_status]=1
 * @apiParam {Array} [include] For including relationships [user, vaultShipmentStatus, billingAddress, shippingAddress, vaultShipmentItems]
 * @apiSuccess {Object} data Vault data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *         "data": [
 *            {
 *                "id": 16,
 *                "shipment_number": "931601d2-c834-362d-af68-e8a4eefdc70e",
 *                "created_at": "2022-04-08T17:04:31.000000Z",
 *                "shipped_at": null,
 *                "customer": {
 *                    "id": 74,
 *                    "customer_number": "7mh9DYdlbd",
 *                    "first_name": "Bertrand",
 *                    "last_name": "Dietrich",
 *                    "email": "xanderson@example.org",
 *                    "phone": null
 *                },
 *                "billing_address": {
 *                    "id": 56,
 *                    "first_name": "Isobel",
 *                    "last_name": "Gaylord",
 *                    "address": "9670 Mohammad Extension Suite 291\nAbshirefurt, AK 72546",
 *                    "city": "East Amira",
 *                    "state": "assumenda",
 *                    "zip": "13169",
 *                    "phone": "781-923-5848",
 *                    "flat": "10",
 *                    "country": {
 *                        "id": 63,
 *                        "code": "CI",
 *                        "name": "Cape Verde"
 *                    }
 *                },
 *                "shipping_address": {
 *                    "id": 55,
 *                    "first_name": "Kraig",
 *                    "last_name": "Bartoletti",
 *                    "address": "8138 Nico Overpass\nPort Colten, TX 11851-4996",
 *                    "city": "West Americoberg",
 *                    "state": "quaerat",
 *                    "zip": "05746-4917",
 *                    "phone": "1-540-610-2918",
 *                    "flat": "3",
 *                    "country": {
 *                        "id": 62,
 *                        "code": "AG",
 *                        "name": "Portugal"
 *                    }
 *                },
 *                "shipment_item": [],
 *                "cards_number": 0,
 *                "tracking_number": null,
 *                "tracking_url": null
 *            },
 *            {
 *                "id": 17,
 *                "shipment_number": "a5739a7a-6523-3032-8060-0da3e721fd87",
 *                "created_at": "2022-04-08T17:04:31.000000Z",
 *                "shipped_at": null,
 *                "customer": {
 *                    "id": 76,
 *                    "customer_number": "knTRSA3mR5",
 *                    "first_name": "Rae",
 *                    "last_name": "Runolfsson",
 *                    "email": "rhiannon.larson@example.org",
 *                    "phone": null
 *                },
 *                "billing_address": {
 *                    "id": 58,
 *                    "first_name": "Annabell",
 *                    "last_name": "Baumbach",
 *                    "address": "530 Tremblay Drive\nNorth Ernestochester, NM 97673-3430",
 *                    "city": "New Krystal",
 *                    "state": "est",
 *                    "zip": "93733-5249",
 *                    "phone": "(878) 743-9228",
 *                    "flat": "6",
 *                    "country": {
 *                        "id": 65,
 *                        "code": "GS",
 *                        "name": "Norfolk Island"
 *                    }
 *                },
 *                "shipping_address": {
 *                    "id": 57,
 *                    "first_name": "Vidal",
 *                    "last_name": "Christiansen",
 *                    "address": "472 Lillie Ridges\nSouth Oral, AL 02483-3065",
 *                    "city": "West Kenville",
 *                    "state": "reprehenderit",
 *                    "zip": "67373",
 *                    "phone": "769-462-9046",
 *                    "flat": "5",
 *                    "country": {
 *                        "id": 64,
 *                        "code": "GU",
 *                        "name": "Switzerland"
 *                    }
 *                },
 *                "shipment_item": [],
 *                "cards_number": 0,
 *                "tracking_number": null,
 *                "tracking_url": null
 *            }
 *        ]
 *      }
 */
