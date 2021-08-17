/* eslint-disable camelcase */
/**
 * This file it's crucial in production since this will set the cdn base at the runtime
 * Because at the build time we don't know the version or the checksum of the version
 */
// @ts-ignore
__webpack_public_path__ = window.__public_path__ || '/';
