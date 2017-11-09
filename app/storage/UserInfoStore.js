/**
 * 用户基本信息
 * Created by beansoft on 2017/6/9.
 */
import {KEY_USER_TOKEN, KEY_USER_INFO} from '../config';
import './Preferences';

let UserInfoStore = {};
let KEY_JPUSH_ID = "KEY_JPUSH_ID";
let LAST_USER_PHONE = "LAST_USER_PHONE";// 上次登陆后的用户手机号
const KEY_COMPANY_INFO = "KEY_COMPANY_INFO";// 公司信息
// 返回是否已登陆
UserInfoStore.isLogined = async function (): boolean {
   let user = await UserInfoStore.getUserInfo();
   if(user === null) {
       return false;
   } else {
       if(user.mobilePhone) {// 有手机号才能判断为登陆成功
           return true;
       }
   }

   return false;
};

UserInfoStore.getUserInfo = async function (): Object {
    let value = await Preferences.get(KEY_USER_INFO);
    if (value !== null) {
        console.log('getUserInfo', value);
        return JSON.parse(value);
    }
    return value;
};

UserInfoStore.setUserInfo = async function (value: Object) {
    console.log('setUserInfo', value);
    return Preferences.set(KEY_USER_INFO, JSON.stringify(value));
};

UserInfoStore.removeUserInfo = async function () {
    console.log('UserInfoStore.removeUserInfo()');
    return Preferences.remove(KEY_USER_INFO);
};

UserInfoStore.getUserToken = async function () {
    return await Preferences.get(KEY_USER_TOKEN);
};

UserInfoStore.setUserToken = async function (value: string) {
    return Preferences.set(KEY_USER_TOKEN, value);
};

UserInfoStore.removeUserToken = async function () {
    return Preferences.remove(KEY_USER_TOKEN);
};

UserInfoStore.getLastUserPhone = async function (): Object {
    return await Preferences.get(LAST_USER_PHONE);
};

UserInfoStore.setLastUserPhone = async function (value: string) {
    return Preferences.set(LAST_USER_PHONE, value);
};

UserInfoStore.removeLastUserPhone = async function () {
    return Preferences.remove(LAST_USER_PHONE);
};

UserInfoStore.getJPushID = async function () {
    return await Preferences.get(KEY_JPUSH_ID);
};

UserInfoStore.setJPushID = async function (value: string) {
    return Preferences.set(KEY_JPUSH_ID, value);
};

UserInfoStore.getCompany = async function () {
    // return await Preferences.get(KEY_COMPANY_INFO);
    let value = await Preferences.get(KEY_COMPANY_INFO);
    if (value !== null) {
        console.log('getCompany', value);
        return JSON.parse(value);
    }
    return value;
};

UserInfoStore.setCompany = async function (value: object) {
    return Preferences.set(KEY_COMPANY_INFO, JSON.stringify(value));
};

UserInfoStore.removeCompany = async function () {
    return Preferences.remove(KEY_COMPANY_INFO);
};

global.UserInfoStore = UserInfoStore;// 全局可用