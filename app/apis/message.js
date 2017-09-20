/**
 * Created by zhuangzihao on 2017/9/20.
 */
import {postApi, getApi} from './common';
export function loadMessageData(count = 15, sinceId = '') {
    return postApi('/app/v0/message/list', {count, sinceId});
}

export function loadMessageReaded( msgId = '') {
    return postApi('/app/v0/message/markRead', {msgId});
}

// 获取所有未读消息数
export function loadMessageTotalReaded( ) {
    return postApi('/app/v0/message/list/count');
}