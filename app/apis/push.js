/**
 * JPush相关接口
 */
import {postApi, getApi} from './common';

// 绑定设备
export function bindJPush(  identifier = '') {
  return postApi('/app/v0/message/push/bind', { identifier});
}

// 解绑定设备
export async function unbindJPush(identifier = '') {
    return await postApi('/app/v0/message/push/unbind', {identifier});
}

