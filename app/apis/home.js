/**
 * Created by zhuangzihao on 2017/9/29.
 */
import {getApi,postApi} from './common';
//产品数据
export function loadHomeData(type = '0') {
    //v1
    return getApi('/api/v1/columns',{type});
}
//轮播图接口
export function loadHomeBanner() {
    //v1
    return getApi('/api/v1/banners');
}

export function loadHomeTipBoxInfo() {
    return getApi('/api/v1/activity/home');
}
export function verifyInvoice(step = '1',params) {
    return postApi('/api/v1/receipt/verify?step=' + step,params);
}

