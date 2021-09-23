import { AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';

export function bracketParams(): AxiosRequestConfig {
    return {
        paramsSerializer(params) {
            return stringify(params, { arrayFormat: 'brackets' });
        },
    };
}
