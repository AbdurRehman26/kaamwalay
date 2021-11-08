/**
 * @api {post} /files/presign Create a presigned S3 URL
 * @apiGroup Files
 * @apiName Presign
 * @apiDescription Prepare a signed S3 URL for an s3 path where the file can be uploaded.
 *
 * Allowed template variables are:
 * - `{uid}` - The user id
 * - `{year}` - Current year
 * - `{mon}` - Current month
 * - `{day}` - Current day
 * - `{hour}` - Current hour
 * - `{min}` - Current minute
 * - `{sec}` - Current second
 * - `{ext}` - File extension
 *
 * Key template:
 * `/user/{uid}/{year}-{mon}-{day}[/{prefix}]/{sha1(file_name,size,content_type)}[/{suffix}].{ext}`
 * @apiUse AuthorizationOptional
 *
 * @apiBody {string} file_name The path to the file.
 * @apiBody {string} content_type The mime_type of the file.
 * @apiBody {number} size The size of the file.
 *
 * @apiParam {string} file_name The path to the file.
 * @apiParam {string} content_type The mime_type of the file.
 * @apiParam {number} size The size of the file.
 * @apiParam {string} prefix The prefix path placed before hashed filename. [Support template variables]
 * @apiParam {string} suffix The suffix path placed after hashed filename but before file extension. [Support template variables]
 *
 * @apiSuccess {Object} data              Data json object.
 * @apiSuccess {String} data.url          Presigned S3 URL.
 * @apiSuccess {Number} data.size         File size.
 * @apiSuccess {String} data.file_name    File name.
 * @apiSuccess {String} data.content_type File content type.
 * @apiSuccess {String} data.prefix       File prefix.
 * @apiSuccess {String} data.suffix       File suffix.
 * @apiSuccess {String} data.key          File key format `/user/{uid}/{year}-{mon}-{day}[/{prefix}]/{sha1(file_name,size,content_type)}[/{suffix}].{ext}`
 * @apiSuccessExample Success Request:
 *     HTTP/1.1 200 OK
 *      {
 *          "data": {
 *              "size": 1024,
 *              "file_name": "scratch_5.http",
 *              "content_type": "plain/text",
 *              "prefix": "",
 *              "suffix": "",
 *              "url": "http://minio:9000/robograding/users/1/2021-11-08/edef9764444e6c48c098335809cf1b9f2b1bf085.http?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=sail%2F20211108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211108T194123Z&X-Amz-SignedHeaders=host&X-Amz-Expires=600&X-Amz-Signature=761d548648a14fa00fb288bde7dc6431fe33a82655068d3761eec3cace87dd25",
 *              "key": "/users/1/2021-11-08/edef9764444e6c48c098335809cf1b9f2b1bf085.http"
 *          }
 *      }
 */
