/**
 * @api {post} /login User Login
 * @apiName User Login
 * @apiGroup Authentication
 *
 * @apiUse header_main
 *
 * @apiParam { String } email email of the user
 * @apiParam { String } password password of the user
 *
 * @apiSuccess {Array} data containing token and user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": [
 *              "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTYyODA3ODcxMCwiZXhwIjoxNjU5NjE0NzEwLCJuYmYiOjE2MjgwNzg3MTAsImp0aSI6ImtJdW9MdU1NNlNzckhkN3QiLCJzdWIiOjIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.z0OsnqkKlcLYp9V7zkjvOCT1rBhLvfXlfWxHG_lYuRc"
 *              "user": {
 *                  "id": 18,
 *                  "first_name": "Jane",
 *                  "last_name": "Doe",
 *                  "email": "test@test.test",
 *                  "username": "test",
 *                  "phone": null,
 *                  "stripe_id": "cus_K0651IOZjCy9Wa",
 *                  "roles": [
 *                      {
 *                          "id": 2,
 *                          "name": "customer"
 *                      }
 *                  ]
 *              }
 *          ]
 *      }
 */
