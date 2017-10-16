/**
 * Created by zhuangzihao on 2017/9/29.
 */
import {getApi} from './common';

export function loadHomeData(type = '0') {
    //v1
    return getApi('/api/mock/columns',{type});
}