/**
 * 通用请求的封装
 */
import {API_BASE_URL, UAA_DOMAIN_URL} from '../config';
import HTTPBase from '../http/HTTPBase';

export async function postApi(uri, params = {}, headers = {}) {
    return HTTPBase.postEx(API_BASE_URL + uri, params, headers);
}

// 返回原始的response对象, 不进行任何解析.
export async function postRawApi(uri, params = {}, headers = {}) {
    return HTTPBase.postRaw(API_BASE_URL + uri, params, headers);
}

export async function getApi(uri, params = {}, headers = {}) {
    return HTTPBase.getEx(API_BASE_URL + uri, params, headers);
}

export async function getApiUAA(uri, params = {}, headers = {}) {
    return HTTPBase.getRaw(UAA_DOMAIN_URL + uri, params, headers);
}

export async function deleteApi(uri, params = {}, headers = {}) {
    return HTTPBase.deleteEx(API_BASE_URL + uri, params, headers);
}

export async function deleteApiUAA(uri, params = {}, headers = {}) {
    return HTTPBase.deleteRaw(UAA_DOMAIN_URL + uri, params, headers);
}