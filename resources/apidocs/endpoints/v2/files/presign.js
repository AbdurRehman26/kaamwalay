/**
 * @api {post} /v2/files/presign Create a presign S3 URL
 * @apiGroup Files
 * @apiName Presign
 * @apiDescription Prepare a signed S3 URL for an s3 path where the file can be uploaded.
 *
 * Path variables:
 * - `{uid}`  - The user id
 * - `{year}`  - Current year
 * - `{mon}`  - Current month
 * - `{day}`  - Current day
 * - `{hour}` - Current hour
 * - `{min}`  - Current minute
 * - `{sec}`  - Current second
 * - `{ext}`  - File extension
 * - `{hash}` - Sha1 hash of Filename, size, and content type.
 *
 * @apiVersion 2.0.0
 *
 * @apiUse AuthorizationOptional
 *
 * @apiBody {string} file_name The path to the file.
 * @apiBody {string} content_type The mime_type of the file.
 * @apiBody {number} size The size of the file.
 *
 * @apiParam {string} file_name The path to the file.
 * @apiParam {string} content_type The mime_type of the file.
 * @apiParam {number} size The size of the file.
 * @apiParam {string} prefix='users/{uid}/files' Prefix path. [Support path variables]
 * @apiParam {string} directory='dates/{year}-{mon}-{day}' Directory path. [Support path variables]
 * @apiParam {string} suffix='{hash}' Suffix path. [Support path variables]
 *
 * @apiSuccess {Object} data              Data json object.
 * @apiSuccess {String} data.signed_url   Signed S3 URL.
 * @apiSuccess {String} data.public_url   Public S3 URL.
 * @apiSuccess {Number} data.size         File size.
 * @apiSuccess {String} data.file_name    File name.
 * @apiSuccess {String} data.content_type File content type.
 * @apiSuccess {String} data.key          File key format `/{root}/{prefix}/{suffix}.{ext}`
 * @apiSuccessExample Success Request:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "size": 1024,
 *              "file_name": "test.txt",
 *              "content_type": "plain/text",
 *              "signed_url": "http://minio:9000/robograding/users/1/files/dates/2021-11-09/edef9764444e6c48c098335809cf1b9f2b1bf085.http?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=sail%2F20211109%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211109T112200Z&X-Amz-SignedHeaders=host&X-Amz-Expires=600&X-Amz-Signature=ba659a6450dbbe224082f3ce26eede9f51835e5426eab4dbc8edecb71f359314",
 *              "public_url": "http://minio:9000/robograding/users/1/files/dates/2021-11-09/edef9764444e6c48c098335809cf1b9f2b1bf085.txt",
 *              "key": "users/1/files/dates/2021-11-09/edef9764444e6c48c098335809cf1b9f2b1bf085.txt"
 *          }
 *      }
 */
