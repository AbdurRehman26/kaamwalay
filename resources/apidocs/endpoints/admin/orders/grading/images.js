/**
 * @api {put} /admin/user-cards/1/images Update Card Grades Images
 * @apiName Update Card Grades Images
 * @apiGroup Order Cards
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {String} source URL of the uploaded image. Must be a valid URL
 * @apiParam {String} field model value for the image source. E.g: front_centering_img_src
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "source": "https://s3.com/awesome-image.png",
 *          "field": "front_centering_img_src",
 *      }
 *
 * @apiSuccess {Object} data UserCardResource
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "data": {
 *              "id": 1,
 *              "customer": {
 *                  "id": 12,
 *                  "first_name": "Keven",
 *                  "last_name": "Rutherford",
 *                  "email": "lue.dickinson@example.org",
 *                  "phone": null
 *              },
 *              "human_grade_values": {
 *                  "front": {
 *                      "center": 4,
 *                      "surface": 5,
 *                      "edge": 4,
 *                      "corner": 8
 *                  },
 *                  "back": {
 *                      "center": 5,
 *                      "surface": 4,
 *                      "edge": 3,
 *                      "corner": 9
 *                  }
 *              },
 *              "robo_grade_values": {
 *                  "front": {
 *                      "center": 4,
 *                      "surface": 5,
 *                      "edge": 4,
 *                      "corner": 8
 *                  },
 *                  "back": {
 *                      "center": 5,
 *                      "surface": 4,
 *                      "edge": 3,
 *                      "corner": 9
 *                  }
 *              },
 *              "overall_values": {
 *                  "center": 4.5,
 *                  "surface": 4.5,
 *                  "edge": 3.5,
 *                  "corner": 8.5
 *              },
 *              "overall_grade": 5.3,
 *              "grading_id": null,
 *              "ai_model_number": null,
 *              "front_centering_img_src": "https://s3.com/awesome-image.png",
 *              "front_surface_img_src": null,
 *              "front_edges_img_src": null,
 *              "front_corners_img_src": null,
 *              "back_centering_img_src": null,
 *              "back_surface_img_src": null,
 *              "back_edges_img_src": null,
 *              "back_corners_img_src": null,
 *              "updated_at": "2021-09-09T07:24:43.000000Z"
 *          }
 *      }
 */
