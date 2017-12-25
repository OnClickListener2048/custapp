/**
 * 用户基本信息
 * Created by beansoft on 2017/6/9.
 */
import {KEY_USER_TOKEN, KEY_USER_INFO} from '../config';
import './Preferences';

let UserInfoStore = {};
let KEY_JPUSH_ID = "KEY_JPUSH_ID";
let UPGRADE_ALERT = "UPGRADE_ALERT";//版本更新弹窗
let UPGRADE_SETTING = "UPGRADE_SETTING";//版本更新设置new
let NEW_VERSION = "NEW_VERSION";//线上最新版本
let LAST_USER_PHONE = "LAST_USER_PHONE";// 上次登陆后的用户手机号
const KEY_COMPANY_INFO = "KEY_COMPANY_INFO";// 公司信息
const KEY_COMPANYARR_INFOS = "KEY_COMPANYARR_INFOS";// 公司信息数组
const KEY_MOBILE_INFO = "KEY_MOBILE_INFO";// 苹果审核开关

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
//版本更新弹窗
UserInfoStore.getUpgrade_alert = async function () {
    let value = await Preferences.get(UPGRADE_ALERT);
    if (value !== null) {
        console.log('getUpgrade_alert', value);
        return JSON.parse(value);
    }
    return value;
};

UserInfoStore.setUpgrade_alert = async function (value: object) {
    return Preferences.set(UPGRADE_ALERT, JSON.stringify(value));
};

UserInfoStore.removeUpgrade_alert = async function () {
    return Preferences.remove(UPGRADE_ALERT);
};

//版本更新设置new
UserInfoStore.getUpgrade_setting = async function () {
    let value = await Preferences.get(UPGRADE_SETTING);
    if (value !== null) {
        console.log('getUpgrade_alert', value);
        return JSON.parse(value);
    }
    return value;
};

UserInfoStore.setUpgrade_setting = async function (value: object) {
    return Preferences.set(UPGRADE_SETTING, JSON.stringify(value));
};

UserInfoStore.removeUpgrade_setting = async function () {
    return Preferences.remove(UPGRADE_SETTING);
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

UserInfoStore.setCompanyArr = async function (value: object) {
    return Preferences.set(KEY_COMPANYARR_INFOS, JSON.stringify(value));
};

UserInfoStore.removeCompanyArr = async function () {
    return Preferences.remove(KEY_COMPANYARR_INFOS);
};

UserInfoStore.getCompanyArr = async function () {
    // return await Preferences.get(KEY_COMPANY_INFO);
    let value = await Preferences.get(KEY_COMPANYARR_INFOS);
    if (value !== null) {
        console.log('getCompanyArr', value);
        return JSON.parse(value);
    }
    return value;
};

UserInfoStore.setMobileLoginInfo = async function (value: object) {
 return Preferences.set(KEY_MOBILE_INFO, JSON.stringify(value));
};

UserInfoStore.getMobileLoginInfo = async function () {
    let value = await Preferences.get(KEY_MOBILE_INFO);
    if (value) {
        console.log('getMobileLoginInfo', value);
        return JSON.parse(value);
    }
    return value;
};

UserInfoStore.removeMobileLoginInfo = async function () {
    return Preferences.remove(KEY_MOBILE_INFO);
};

global.UserInfoStore = UserInfoStore;// 全局可用