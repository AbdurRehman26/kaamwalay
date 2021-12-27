/**
 * @api {post} /customer/coupons/calculate-discount Calculate Discount
 * @apiName Calculate Discount on Coupon
 * @apiGroup Customer Coupons
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "payment_plan": {
 *              "id": 1
 *          },
 *          "items": [
 *              {
 *                  "card_product": {
 *                      "id": 1
 *                  },
 *                  "quantity": 1,
 *                  "declared_value_per_unit": 500
 *              },
 *              {
 *                  "card_product": {
 *                      "id": 2
 *                  },
 *                  "quantity": 10,
 *                  "declared_value_per_unit": 500
 *              }
 *          ],
 *          "shipping_method": {
 *              "id": 1
 *          },
 *          "payment_method": {
 *              "id": 1
 *          },
 *          "coupon": {
 *              "code": "HvTGSYpak9",
 *              "id": 2
 *          },
 *
 *      }
 *
 * @apiSuccess {Object} data Order object
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *    {
 *        "data": {
 *            "discounted_amount": 29,
 *            "coupon": {
 *                  "id": 1,
 *                  "code": "HvTGSYpak9",
 *                  "discount_statement": "20.00 Off",
 *            }
 *        }
 *    }
 */
