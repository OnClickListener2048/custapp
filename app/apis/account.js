/**
 * 用户相关接口
 */
import {postApi} from './common';

// 登陆
export function login( phone = '', smsCode = '') {
  return postApi('/app/v0/user/login/phone', {phone, smsCode});
}

// 短信验证码
export async function sendVerifyCode(phone = '', verifyCode = '') {
    return await postApi('/app/v0/user/smscode/get', {phone, verifyCode});
}

// 校验图形验证码
export async function sendVerifyVCode(phone = '', vcode = '') {
    return await postApi('/app/v0/user/vcode/verify', {phone, vcode});
}

// 问题反馈
export function sendFeedback({message = '', userName = ''}) {
  return postApi('/app/v0/feedback', {message, userName});
}

// 用户信息
export function userInfo() {
  return postApi('/app/v0/user/info');
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