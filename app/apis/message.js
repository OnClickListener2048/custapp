/**
 * Created by zhuangzihao on 2017/9/20.
 */
import {postApi, getApi,deleteApi,putEx} from './common';
export function loadMessageData(count = 10, page = 1) {
    return getApi('/api/v1/messages', {count, page});
}


export function postMessageReaded(id = '') {
    return postApi('/api/v1/messages/' + id);
}

// 获取服务的新消息数
export function loadMessageUnReadedNum( ) {
    return getApi('/api/v1/messages/new');
}

export function putClearMessageUnReadedNum( ) {
    return putEx('/api/v1/messages/clear');
}


