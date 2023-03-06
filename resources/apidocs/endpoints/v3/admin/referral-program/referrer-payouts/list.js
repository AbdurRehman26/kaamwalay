/**
 * @api {post} /api/v3/admin/referral-program/payouts Get Payouts List
 * @apiName Get Payouts List
 * @apiGroup Admin Referral Program
 *
 * @apiVersion 3.0.0
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} [filter[search]] For payouts list based on: user first name, last name, customer_number and email. E.g. filter[search]=john
 * @apiParam {Array} [filter[user_id]] For filtering records by user ID. E.g. filter[user_id]=1
 * @apiParam {Array} [filter[referrer_payout_status_id]] For filtering records by status code. E.g. filter[payment_status]=1, filter[payment_status]=2, filter[payment_status]=3
 *
 * @apiSuccess {Object} data User data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 * 		    "data": [
 * 			{
 * 			    "id": 1,
 * 			    "user": {
 * 				    "id": 18,
 * 				    "profile_image": "http://minio:9000/robograding/users/18/files/dates/2022-11-14/6qW2XkuI_400x400.png",
 * 				    "first_name": "John",
 * 				    "last_name": "Doe",
 * 				    "full_name": "John Doe",
 * 				    "customer_number": "C00000018"
 * 			    },
 * 			    "created_at": "2023-05-03T08:00:00.000000Z",
 * 			    "completed_at": null,
 * 			    "payout_account": "john.doe@example.org",
 * 			    "paid_by": {
 * 				    "id": 18,
 * 				    "profile_image": "http://minio:9000/robograding/users/18/files/dates/2022-11-14/6qW2XkuI_400x400.png",
 * 				    "first_name": "John",
 * 				    "last_name": "Doe",
 * 				    "full_name": "John Doe",
 * 				    "customer_number": "C00000018"
 * 			    },
 * 			    "status": {
 * 				    "id": 1,
 * 				    "code": "pending",
 * 				    "name": "Pending",
 * 				    "description": ""
 * 			    },
 * 			    "amount": "10.00"
 * 			}
 * 		    ],
 * 		    "links": {
 * 			    "first": "http://robograding.test/api/v3/admin/referral-program/payouts?page=1",
 * 			    "last": "http://robograding.test/api/v3/admin/referral-program/payouts?page=1",
 * 			    "prev": null,
 * 			    "next": null
 * 		    },
 * 		    "meta": {
 * 			    "current_page": 1,
 * 			    "from": 1,
 * 			    "last_page": 1,
 * 			    "links": [
 * 			        {
 * 			    	    "url": null,
 * 			    	    "label": "&laquo; Previous",
 * 			    	    "active": false
 * 			        },
 * 			        {
 * 			    	    "url": "http://robograding.test/api/v3/admin/referral-program/payouts?page=1",
 * 			    	    "label": "1",
 * 			    	    "active": true
 * 			        },
 * 			        {
 * 			    	    "url": null,
 * 			    	    "label": "Next &raquo;",
 * 			    	    "active": false
 * 			        }
 * 			    ],
 * 			    "path": "http://robograding.test/api/v3/admin/referral-program/payouts",
 * 			    "per_page": 10,
 * 			    "to": 1,
 * 			    "total": 1
 * 		    }
 * 		}
 */
