/**
 * @api {post} /customer/payment-cards/setup Setup Payment Method
 * @apiName Setup a new Payment Method
 * @apiGroup Payment-Methods
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiSuccess {Object} containing setup intent object of stripe
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "intent": {
 *              "id": "seti_1JLvBKAPJFsEiKJRaCqtzxZl",
 *              "object": "setup_intent",
 *              "application": null,
 *              "cancellation_reason": null,
 *              "client_secret": "seti_1JLvBKAPJFsEiKJRaCqtzxZl_secret_Jzv16I7tDUiS9fTaJhVxJazqFJg4OKb",
 *              "created": 1628364462,
 *              "customer": null,
 *              "description": null,
 *              "last_setup_error": null,
 *              "latest_attempt": null,
 *              "livemode": false,
 *              "mandate": null,
 *              "metadata": [],
 *              "next_action": null,
 *              "on_behalf_of": null,
 *              "payment_method": null,
 *              "payment_method_options": {
 *                  "card": {
 *                      "request_three_d_secure": "automatic"
 *                  }
 *              },
 *              "payment_method_types": [
 *                  "card"
 *              ],
 *              "single_use_mandate": null,
 *              "status": "requires_payment_method",
 *              "usage": "off_session"
 *          }
 *      }
 */
