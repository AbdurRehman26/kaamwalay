/**
 * @api {get} /v3/admin/orders List orders
 * @apiName List Orders
 * @apiGroup Admin Orders
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For for searching orders list based on these columns: order ID, customer Name and Customer ID. E.g. filter[search]=1
 * @apiParam {Array} [filter[order_id]] For filtering records by order ID. E.g. filter[order_id]=1
 * @apiParam {Array} [filter[order_number]] For filtering records by order number. E.g. filter[order_number]=RG000000029
 * @apiParam {Array} [filter[order_status]] For filtering records by order number. E.g. filter[order_status]=3
 * @apiParam {Array} [filter[customer_id]] For filtering records by customer ID. E.g. filter[customer_id]=1
 * @apiParam {Array} [filter[customer_name]] For filtering records by customer name. E.g. filter[customer_name]=Jhon
 * @apiParam {Array} [filter[status]] For filtering records by order's status code. E.g. filter[status]=arrived, filter[status]=1
 * @apiParam {Array} [filter[payment_status]] For filtering records by order's payment status code. E.g. filter[payment_status]=0, filter[payment_status]=1
 * @apiParam {string} sort For sorting records, supporting params are [grand_total, -grand_total]. E.g. sort=grand_total
 * @apiParam {Array} [include] For including relationships [invoice, paymentPlan, orderItems, orderStatus, orderPayment, billingAddress,
 *  shippingAddress, orderStatusHistory, orderStatus, user, orderShipment, orderCustomerShipment, salesman, orderLabel, shippingMethod, coupon]
 * @apiSuccess {Object} data Orders data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    "data":[
 *       {
 *          "id":512,
 *          "order_number":"RG000000512",
 *          "number_of_cards":100,
 *          "total_declared_value":100,
 *          "grand_total":1600,
 *          "customer":{
 *             "id":18,
 *             "customer_number":"C00000018",
 *             "first_name":"Luis",
 *             "last_name":"Molina",
 *             "email":"luis@wooter.com",
 *             "phone":"+571234567890",
 *             "wallet":{
 *                "id":35,
 *                "balance":34.5
 *             },
 *             "referredBy":null
 *          },
 *          "owner":null,
 *          "order_status":{
 *             "id":2,
 *             "code":"placed",
 *             "name":"Placed",
 *             "description":"Order is paid and placed",
 *             "created_at":"2021-12-01T20:51:02.000000Z",
 *             "updated_at":"2021-12-01T20:51:02.000000Z"
 *          },
 *          "payment_status":2,
 *          "invoice":{
 *             "id":693,
 *             "invoice_number":"RG000000512",
 *             "path":"http:\/\/minio:9000\/robograding\/invoice\/ff7ca136-8eec-4b3a-b0d2-d1399b6a95ce.pdf",
 *             "created_at":"2023-03-29T12:36:44.000000Z",
 *             "updated_at":"2023-03-29T12:36:44.000000Z"
 *          },
 *          "order_label":null,
 *          "order_status_history":[
 *             {
 *                "id":610,
 *                "notes":null,
 *                "order_id":512,
 *                "order_status_id":2,
 *                "created_at":"2023-03-29T12:36:42.000000Z",
 *                "updated_at":"2023-03-29T12:36:42.000000Z"
 *             }
 *          ],
 *          "arrived":false,
 *          "arrived_at":null,
 *          "created_at":"2023-03-29T12:36:40.000000Z",
 *          "order_shipment":null,
 *          "shipping_method":{
 *             "id":2,
 *             "code":"vault_storage",
 *             "name":"Vault Storage"
 *          },
 *          "coupon":null,
 *          "salesman_commission":null
 *       },
 *       {
 *          "id":511,
 *          "order_number":"RG000000511",
 *          "number_of_cards":30,
 *          "total_declared_value":30,
 *          "grand_total":531.25,
 *          "customer":{
 *             "id":18,
 *             "customer_number":"C00000018",
 *             "first_name":"Luis",
 *             "last_name":"Molina",
 *             "email":"luis@wooter.com",
 *             "phone":"+571234567890",
 *             "wallet":{
 *                "id":35,
 *                "balance":34.5
 *             },
 *             "referredBy":null
 *          },
 *          "owner":null,
 *          "order_status":{
 *             "id":3,
 *             "code":"confirmed",
 *             "name":"Confirmed",
 *             "description":"Order is confirmed.",
 *             "created_at":"2021-12-01T20:51:02.000000Z",
 *             "updated_at":"2021-12-01T20:51:02.000000Z"
 *          },
 *          "payment_status":2,
 *          "invoice":{
 *             "id":691,
 *             "invoice_number":"RG000000511",
 *             "path":"http:\/\/minio:9000\/robograding\/invoice\/d0716313-9e14-419d-8094-842987cafc73.pdf",
 *             "created_at":"2023-03-23T19:01:56.000000Z",
 *             "updated_at":"2023-03-23T19:01:56.000000Z"
 *          },
 *          "order_label":null,
 *          "order_status_history":[
 *             {
 *                "id":608,
 *                "notes":null,
 *                "order_id":511,
 *                "order_status_id":2,
 *                "created_at":"2023-03-22T14:20:53.000000Z",
 *                "updated_at":"2023-03-22T14:20:53.000000Z"
 *             },
 *             {
 *                "id":609,
 *                "notes":null,
 *                "order_id":511,
 *                "order_status_id":3,
 *                "created_at":"2023-03-22T14:23:52.000000Z",
 *                "updated_at":"2023-03-22T14:23:52.000000Z"
 *             }
 *          ],
 *          "arrived":true,
 *          "arrived_at":"2023-03-22T00:00:00.000000Z",
 *          "created_at":"2023-03-22T14:20:52.000000Z",
 *          "order_shipment":null,
 *          "shipping_method":{
 *             "id":1,
 *             "code":"insured_shipping",
 *             "name":"Insured Shipping"
 *          },
 *          "coupon":null,
 *          "salesman_commission":null
 *       },
 *       {
 *          "id":510,
 *          "order_number":"RG000000510",
 *          "number_of_cards":1,
 *          "total_declared_value":1,
 *          "grand_total":18,
 *          "customer":{
 *             "id":139,
 *             "customer_number":"C00000139",
 *             "first_name":"Comm",
 *             "last_name":"Referee",
 *             "email":"comm@example.org",
 *             "phone":"+49 1212 11211",
 *             "wallet":{
 *                "id":111,
 *                "balance":0
 *             },
 *             "referredBy":{
 *                "id":18,
 *                "first_name":"Luis",
 *                "last_name":"Molina",
 *                "full_name":"Luis Molina"
 *             }
 *          },
 *          "owner":null,
 *          "order_status":{
 *             "id":2,
 *             "code":"placed",
 *             "name":"Placed",
 *             "description":"Order is paid and placed",
 *             "created_at":"2021-12-01T20:51:02.000000Z",
 *             "updated_at":"2021-12-01T20:51:02.000000Z"
 *          },
 *          "payment_status":2,
 *          "invoice":{
 *             "id":694,
 *             "invoice_number":"RG000000510",
 *             "path":"http:\/\/minio:9000\/robograding\/invoice\/94c9d15b-440e-468d-88c9-2c29de2376ee.pdf",
 *             "created_at":"2023-03-29T20:58:44.000000Z",
 *             "updated_at":"2023-03-29T20:58:44.000000Z"
 *          },
 *          "order_label":null,
 *          "order_status_history":[
 *             {
 *                "id":607,
 *                "notes":null,
 *                "order_id":510,
 *                "order_status_id":2,
 *                "created_at":"2023-03-20T21:42:56.000000Z",
 *                "updated_at":"2023-03-20T21:42:56.000000Z"
 *             }
 *          ],
 *          "arrived":false,
 *          "arrived_at":null,
 *          "created_at":"2023-03-20T21:42:56.000000Z",
 *          "order_shipment":null,
 *          "shipping_method":{
 *             "id":2,
 *             "code":"vault_storage",
 *             "name":"Vault Storage"
 *          },
 *          "coupon":null,
 *          "salesman_commission":null
 *       }
 *    ],
 *    "links":{
 *       "first":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=1",
 *       "last":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=17",
 *       "prev":null,
 *       "next":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=2"
 *    },
 *    "meta":{
 *       "current_page":1,
 *       "from":1,
 *       "last_page":17,
 *       "links":[
 *          {
 *             "url":null,
 *             "label":"&laquo; Previous",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=1",
 *             "label":"1",
 *             "active":true
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=2",
 *             "label":"2",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=3",
 *             "label":"3",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=4",
 *             "label":"4",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=5",
 *             "label":"5",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=6",
 *             "label":"6",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=7",
 *             "label":"7",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=8",
 *             "label":"8",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=9",
 *             "label":"9",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=10",
 *             "label":"10",
 *             "active":false
 *          },
 *          {
 *             "url":null,
 *             "label":"...",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=16",
 *             "label":"16",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=17",
 *             "label":"17",
 *             "active":false
 *          },
 *          {
 *             "url":"http:\/\/robograding.test\/api\/v3\/admin\/orders?page=2",
 *             "label":"Next &raquo;",
 *             "active":false
 *          }
 *       ],
 *       "path":"http:\/\/robograding.test\/api\/v3\/admin\/orders",
 *       "per_page":24,
 *       "to":24,
 *       "total":387
 *    }
 * }
 */
