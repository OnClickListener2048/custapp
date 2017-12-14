/**
 * 用户相关接口
 * 绑定手机号的API在UAA中定义: https://tower.im/projects/c9a5ffff111d411990d752cefa1493fb/docs/dc94ebe6acc845ff97ddf2d877c65377/
 */
import {postApi, getApi, postRawApi, putEx} from './common';
import {WECHAT_APP_ID} from '../config' ;
import {
    Platform, DeviceEventEmitter
} from 'react-native';



// TODO
export function wechatToken( code = '') {
    return postRawApi('/api/v1/auth/token?code=' + code, {platform:'app'} , {platform:'app', 'client': Platform.OS});//app_id:WECHAT_APP_ID,
}

// 登陆
export function login( phone = '', smsCode = '') {
  return postApi('/app/v0/user/login/phone', {phone, smsCode});
}

// 发送手机验证码并校验图形验证码
export async function sendVerifyCode(mobile = '', type = '1', imgcode = '', device = '') {
    return postApi('/api/v1/verificodes/sms?mobile='+mobile+'&type='+type+'&imgcode='+imgcode + '&device='+device, {});
}

// 绑定关联新手机号
export async function editPhoneBind(mobile = '', smscode = '', ) {
    return putEx('/api/v1/user/binding?mobile='+mobile+'&smscode='+smscode );
}

/**
 * 获取图形验证码
 *
 device(*): 设备标识
 type(*): 1绑定手机号 5企业核名
 Response
 code
 msg
 img 图形验证码 图片base64位编码
 * @returns {Promise.<*>}
 */
export async function getVerifyVCodeImage(device = '', type = '1') {
    return postApi('/api/v1/verificodes/image?device='+device+'&type='+type, {});
}

/**
 * 获取公司信息
 */
export async function getCompany(mobile = '') {
    return getApi('/api/v1.01/companies', {mobile});


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

// iOS 提审登陆信息
export function mobilelogin() {
    return getApi('/api/v1/user/mobilelogin/option');
}

// // 图片验证码
// export async function sendImageVerifyCode(phone = '') {
//     return await postRawApi('/app/v0/user/vcode/get', {phone});
// }