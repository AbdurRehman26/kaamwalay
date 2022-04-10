/**
 * @api {get} /v2/admin/vauls/1 Show Vault
 * @apiName Show Vault
 * @apiGroup Admin Vaults
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
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
 *            }
 *        ]
 *      }
 */
