/**
 * @api {get} /customer/payment-cards Users Payment Methods
 * @apiName List Payment Methods
 * @apiGroup Payment-Methods
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Array} data payment methods
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              {
 *                  "id": "pm_1JLxgyJCai8r8pbfCVXFjZo5",
 *                  "object": "payment_method",
 *                  "billing_details": {
 *                      "address": {
 *                          "city": null,
 *                          "country": null,
 *                          "line1": null,
 *                          "line2": null,
 *                          "postal_code": "23123",
 *                          "state": null
 *                      },
 *                      "email": null,
 *                      "name": null,
 *                      "phone": null
 *                  },
 *                  "card": {
 *                      "brand": "visa",
 *                      "checks": {
 *                          "address_line1_check": null,
 *                          "address_postal_code_check": "pass",
 *                          "cvc_check": "pass"
 *                      },
 *                      "country": "DE",
 *                      "exp_month": 12,
 *                      "exp_year": 2031,
 *                      "fingerprint": "aTWYXT2UHNF4kHZk",
 *                      "funding": "credit",
 *                      "generated_from": null,
 *                      "last4": "3184",
 *                      "networks": {
 *                          "available": [
 *                              "visa"
 *                          ],
 *                          "preferred": null
 *                      },
 *                      "three_d_secure_usage": {
 *                          "supported": true
 *                      },
 *                      "wallet": null
 *                  },
 *                  "created": 1628374113,
 *                  "customer": "cus_JznJFVaa5nnDfj",
 *                  "livemode": false,
 *                  "metadata": [],
 *                  "type": "card"
 *              }
 *          ]
 *      }
 */
