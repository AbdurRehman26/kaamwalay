/**
 * @api {post} /v1/customer/orders/{order}/payments/verify-ags Verify AGS Order Payment
 * @apiName Verify Order Payment For AGS Payments
 * @apiGroup Customer-Orders
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 * 
 * @apiParam {Integer} id Order unique ID
 *
 * @apiSuccess {string} transaction_hash Order Transaction Hash
 * @apiSuccess {string} status Status for transaction (success/processing/fail)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
            "transaction_hash": "0x7ee79769e935f914ec5ff3ccc10d767bf5800bc506f2df8e0c274034a3d61a52",
            "status": "success"
        }
 */
