/**
 * Created by beansoft on 2017/7/6.
 */
import '../storage/UserInfoStore';
import {Navigation} from 'react-native-navigation';

let instance = null;

/**
 * 登录跳转单例控制.
 */
export default class LoginJumpSingleton {
    isJumpingLogin = false;// 是否跳转登录页中

    constructor() {
        if(!instance){
            instance = this;
        }
        return instance;
    }

    // 清理用户数据
    reset() {
        UserInfoStore.removeUserToken(null);
        UserInfoStore.removeUserInfo(null);
    }

    goToLogin(navigator) {
        if(navigator !== undefined) {
            if (this.isJumpingLogin === true){
                return;
            }

            this.isJumpingLogin = true;

            // navigator.push
            Navigation.showModal
            ({
                screen: 'user.LoginPage',
                backButtonTitle: '', // 返回按钮的文字 (可选)
                // backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                overrideBackPress: true, // 覆盖Android返回键
                passProps: {
                    isReset: true,
                    // navigator: navigator,
                }
            });
        }
    }

}

global.loginJumpSingleton = new LoginJumpSingleton();// 全局可用