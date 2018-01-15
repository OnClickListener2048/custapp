/**
 * Created by zhuangzihao on 2017/9/20.
 */
import {postApi, getApi,deleteApi,putEx} from './common';
export function loadMessageData(count = 10, page = 1) {
    return getApi('/api/v1/messages', {count, page});
}


export function putMessageReaded() {
    return putEx('/api/v1/messages/01');
}

export function deleteMessageItem( id = '') {
    return deleteApi('/api/mock/messages/:'+id);
}

// 获取所有未读消息数
export function loadMessageUnReadedNum( ) {
    return getApi('/api/v1/messages/unread');
}


export function putClearMessageUnReadedNum( ) {
    return putEx('/api/v1/messages/clear');
}


