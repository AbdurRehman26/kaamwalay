/**
 * @api {post} /v1/auth/password/change Change Password
 * @apiName Register User
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiUse header_main
 *
 * @apiParam { String } current_password Current Password of the User
 * @apiParam { String } password New Password of the User
 * @apiParam { String } password_confirmation Same password as the new password
 *
 * @apiSuccess { String } data.token authentication token
 * @apiSuccess { String } data.type  type of authentication token
 * @apiSuccess { Number } data.expiry time to live for this token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTYyODA3ODcxMCwiZXhwIjoxNjU5NjE0NzEwLCJuYmYiOjE2MjgwNzg3MTAsImp0aSI6ImtJdW9MdU1NNlNzckhkN3QiLCJzdWIiOjIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.z0OsnqkKlcLYp9V7zkjvOCT1rBhLvfXlfWxHG_lYuRc"
 *          "type": "bearer",
 *          "expiry": 60
 *      }
 */
