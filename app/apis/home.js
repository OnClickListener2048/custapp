/**
 * Created by zhuangzihao on 2017/9/29.
 */
import {getApi,postApi} from './common';

export function loadHomeData(type = '0') {
    return getApi('api/mock/columns',{type});
}


export function postTest(type = '1',productname='111',city='北京',name='zzh',tel='111',text='222') {
    return postApi('api/mock/feedbacks',{type,productname,city,name,tel,text});
}