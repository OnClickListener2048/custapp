/**
 * Created by zhuangzihao on 2017/9/20.
 */
import {postApi, getApi,deleteApi} from './common';
export function loadMessageData(count = 10, page = 1) {
    return getApi('/api/mock/messages', {count, page});
}


export function deleteMessageItem( id = '') {
    return deleteApi('/api/mock/messages/:'+id);
}

// 获取所有未读消息数
export function loadMessageTotalReaded( ) {
    return postApi('/app/v0/message/list/count');
}