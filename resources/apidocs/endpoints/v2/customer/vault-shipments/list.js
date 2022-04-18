/**
 * @api {get} /v2/customer/vault-shipments List Vault Shipments
 * @apiName List Vault Shipments
 * @apiGroup Vault Shipments
 *
 * @apiVersion 2.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} data Vault Shipment data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 * 		    "data": [
 *     			{
 *     			    "id": 2,
 *     			    "shipment_number": "801a7850-3082-39b6-8c58-0f976933a0b2",
 *     			    "created_at": "2022-04-06T15:55:24.000000Z",
 *     			    "shipped_at": "2022-04-06T16:55:24.000000Z",
 *     			    "status": {
 *         				"id": 2,
 *         				"code": "shipped",
 *         				"name": "Shipped",
 *         				"description": "shipped"
 *     			    },
 *     			    "cards_number": 1,
 *     			    "tracking_number": "f1f8efb9-b703-4002-8095-5fe3e3a8dac5",
 *     			    "tracking_url": "https://www.google.com"
 *     			},
 *     			{
 *     			    "id": 1,
 *     			    "shipment_number": "fc24c50d-817d-3e28-bd7e-52661a675427",
 *     			    "created_at": "2022-04-06T15:39:05.000000Z",
 *     			    "shipped_at": null,
 *     			    "status": {
 *         				"id": 1,
 *         				"code": "pending",
 *         				"name": "Pending",
 *         				"description": "pending"
 *     			    },
 *     			    "cards_number": 2,
 *     			    "tracking_number": null,
 *     			    "tracking_url": null
 *     			}
 * 		    ],
 * 		    "links": {
 *     			"first": "http://robograding.test/api/v2/customer/vault-shipments?page=1",
 *     			"last": "http://robograding.test/api/v2/customer/vault-shipments?page=1",
 *     			"prev": null,
 *     			"next": null
 * 		    },
 * 		    "meta": {
 *     			"current_page": 1,
 *     			"from": 1,
 *     			"last_page": 1,
 *     			"links": [
 *     			    {
 *         				"url": null,
 *         				"label": "&laquo; Previous",
 *         				"active": false
 *     			    },
 *     			    {
 *         				"url": "http://robograding.test/api/v2/customer/vault-shipments?page=1",
 *         				"label": "1",
 *         				"active": true
 *     			    },
 *     			    {
 *         				"url": null,
 *         				"label": "Next &raquo;",
 *         				"active": false
 *     			    }
 *     			],
 *     			"path": "http://robograding.test/api/v2/customer/vault-shipments",
 *     			"per_page": 15,
 *     			"to": 2,
 *     			"total": 2
 * 		    }
 * 		}
 */
