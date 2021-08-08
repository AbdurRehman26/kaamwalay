/**
 * @api {post} /auth/register Register User
 * @apiName Register User
 * @apiGroup Authentication
 *
 * @apiUse header_main
 *
 * @apiParam { String } first_name First Name of the User
 * @apiParam { String } last_name Last Name of the User
 * @apiParam { String } email Unique Email of the User
 * @apiParam { String } username Unique Username of the User
 * @apiParam { String } password Password of the User
 * @apiParam { String } password_confirmation Confirm password of the User
 * @apiParam { String } [phone] Optional phone number of the User
 *
 * @apiSuccess {Array} data containing token and user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTYyODA3ODcxMCwiZXhwIjoxNjU5NjE0NzEwLCJuYmYiOjE2MjgwNzg3MTAsImp0aSI6ImtJdW9MdU1NNlNzckhkN3QiLCJzdWIiOjIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.z0OsnqkKlcLYp9V7zkjvOCT1rBhLvfXlfWxHG_lYuRc"
 *          "type": "bearer",
 *          "expiry": 60
 *      }
 */
