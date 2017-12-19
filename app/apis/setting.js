/**
 * Created by zhuangzihao on 2017/9/18.
 */
/**
 * 设置 > 修改手机号相关接口
 */
import {postApi, getApi} from './common';

// 检查第一步短信验证码
export function editPhoneEdit(  smsCode = '') {
    return postApi('/app/v0/user/editPhone/edit', { smsCode});
}

// 短信验证码
export async function sendVerifyCode(phone = '') {
    return await postApi('/app/v0/user/editPhone/smscode/get', {phone});
}

// 第二步绑定关联新手机号
export async function editPhoneBind(phone = '', smsCode = '') {
    return await postApi('/app/v0/user/editPhone/bind', {phone, smsCode});
}

//获取版本信息
export function loadupdateCode(version='') {
    return getApi('/api/v1/upgrade/check',{version});
}





// // 图片验证码
// export async function sendImageVerifyCode(phone = '') {
//     return await postRawApi('/app/v0/user/vcode/get', {phone});
// }