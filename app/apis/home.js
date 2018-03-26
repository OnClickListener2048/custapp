/**
 * Created by zhuangzihao on 2017/9/29.
 */
import {getApi,postApi,putEx} from './common';
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
//获取首页是否展示广告弹出框
export function loadHomeTipBoxInfo() {
    return getApi('/api/v1/activity/home');
}

//获取首页实用工具接口
export function loadHomeTools() {
    return getApi('/api/v1/tools');
}
//获取更多实用工具接口
export function loadOtherTools() {
    return getApi('/api/v1/otherTools');
}
