/**
 * 用户相关接口
 * 绑定手机号的API在UAA中定义: https://tower.im/projects/c9a5ffff111d411990d752cefa1493fb/docs/dc94ebe6acc845ff97ddf2d877c65377/
 */
import {postApi, getApi, postRawApi, getApiUAA} from './common';
import {WECHAT_APP_ID} from '../config' ;
import {
    Platform, DeviceEventEmitter
} from 'react-native';

// 获取微信验证码

/**
 * 1、通过微信的app_id获取微信的授权码code
 2、取得微信的授权码后，将授权码传给UAA后端作验证处理
 * @param app_id
 * @param code
 * @returns {Promise}
 */
export function wechatCallback( code = '') {
    return postRawApi('/ua/wechat/callback', { code});//app_id:WECHAT_APP_ID,
}

// TODO
export function wechatToken( code = '') {
    return postRawApi('/api/v1/auth/token?code=' + code, {} , {platform:'app', 'client': Platform.OS});//app_id:WECHAT_APP_ID,
}

// 登陆
export function login( phone = '', smsCode = '') {
  return postApi('/app/v0/user/login/phone', {phone, smsCode});
}

// 发送手机验证码并校验图形验证码
export async function sendVerifyCode(mobile = '', type = '1', imgcode = '') {
    return await postApi('/api/v1/verificodes/sms?mobile='+mobile+'&type='+type+'&imgcode='+imgcode, {});
}

// 绑定关联新手机号
export async function editPhoneBind(mobile = '', smscode = '') {
    return await postApi('/api/v1/user/binding?mobile='+mobile+'&smscode='+smscode);
}

/**
 * 获取图形验证码
 *
 mobile(*): 手机号
 type(*): 1绑定手机号 5企业核名
 Response
 code
 msg
 img 图形验证码 图片base64位编码
 * @returns {Promise.<*>}
 */
export async function getVerifyVCodeImage(mobile = '', type = '1') {
    return await postApi('/api/v1/verificodes/image?mobile='+mobile+'&type='+type, {});
}

// 问题反馈
export function sendFeedback({message = '', userName = ''}) {
  return postApi('/app/v0/feedback', {message, userName});
}

// 用户信息
export function userInfo() {
  return getApi('/api/v1/user/me');
}

// 退出登陆
export function logout() {
  return postApi('/app/v0/user/logout');
}

// 关于
export function about() {
    return postApi('/app/v0/about');
}


// // 图片验证码
// export async function sendImageVerifyCode(phone = '') {
//     return await postRawApi('/app/v0/user/vcode/get', {phone});
// }