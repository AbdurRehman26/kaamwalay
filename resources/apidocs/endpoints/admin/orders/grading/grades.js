/**
 * @api {put} /admin/orders/1/cards/1/grades Update Card Grade Values
 * @apiName Update Grade Values
 * @apiGroup Order Cards
 *
 * @apiUse header_main
 * @apiUse Authorization
 *
 * @apiParam {Array} human_grade_values For user card.
 * @apiParam {Array} human_grade_values.front card front values.
 * @apiParam {Float} human_grade_values.front.center front centering value for card. E.g. center=4.5
 * @apiParam {Float} human_grade_values.front.surface front surfacing value for card. E.g. surface=8.5
 * @apiParam {Float} human_grade_values.front.edge front edges value for card. E.g. edge=6.0
 * @apiParam {Float} human_grade_values.front.corner front corners value for card. E.g. corner=3.5
 * @apiParam {Array} human_grade_values.back card back values.
 * @apiParam {Float} human_grade_values.back.center back centering value for card. E.g. center=4.5
 * @apiParam {Float} human_grade_values.back.surface back surfacing value for card. E.g. surface=8.5
 * @apiParam {Float} human_grade_values.back.edge back edges value for card. E.g. edge=6.0
 * @apiParam {Float} human_grade_values.back.corner back corners value for card. E.g. corner=3.5
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *          "human_grade_values": {
 *              "front": {
 *                  "center": 4.0,
 *                  "surface": 5,
 *                  "edge": 4,
 *                  "corner": 8
 *              },
 *              "back": {
 *                  "center": 5.0,
 *                  "surface": 4,
 *                  "edge": 3,
 *                  "corner": 9
 *              }
 *          }
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
 *              "ai_model_numbers": null,
 *              "generated_images": [
 *                   {
 *                       "output_image": null,
 *                       "name": "Front Centering",
 *                   },
 *                   {
 *                       "output_image": null,
 *                       "name": "Front Surface",
 *                   },
 *                   {
 *                       "output_image": null,
 *                       "name": "Front Edges",
 *                   },
 *                   {
 *                       "output_image": null,
 *                       "name": "Front Corners",
 *                   },
 *                   {
 *                       "output_image": null,
 *                       "name": "Back Centering",
 *                   },
 *                   {
 *                       "output_image": null,
 *                       "name": "Back Surface",
 *                   },
 *                   {
 *                       "output_image": null,
 *                       "name": "Back Edges",
 *                   },
 *                   {
 *                       "output_image": null,
 *                       "name": "Back Corners",
 *                   },
 *              ],
 *              "updated_at": "2021-09-09T07:24:43.000000Z"
 *           }
 *       }
 */
