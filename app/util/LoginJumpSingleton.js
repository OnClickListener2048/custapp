/**
 * Created by beansoft on 2017/7/6.
 */
import '../storage/UserInfoStore';
import {Navigation} from 'react-native-navigation';
import Alert from "react-native-alert";
import JPushModule from "jpush-react-native/index";
import {DeviceEventEmitter, Platform} from "react-native";

let instance = null;

/**
 * 登录跳转单例控制.
 */
export default class LoginJumpSingleton {
    isJumpingLogin = false;// 是否跳转登录页中
    isJumpingLogout = false;// 是否跳转退出登录中

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

    // 跳转到登录页
    goToLogin(navigator,callback) {
        if(navigator !== undefined) {
            if (this.isJumpingLogin === true){
                return;
            }


            this.isJumpingLogin = true;

            // navigator.push
            Navigation.showModal
            ({
                screen: 'LoginPage',
                backButtonTitle: '', // 返回按钮的文字 (可选)
                // backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                overrideBackPress: true, // 覆盖Android返回键
                passProps: {
                    isReset: true,
                    callback:callback
                    // navigator: navigator,
                }
            });
        }
    }

    /**
     * 退出登录并跳转到首页
     * @param navigator React Native Navigation navigator object
     */
    goToLogout(navigator) {
        if(navigator !== undefined) {
            if (this.isJumpingLogout === true){
                return;
            }


            this.isJumpingLogout = true;

            Alert.alert('确定退出', '',
                [
                    {text: '取消',
                        onPress: () => {
                            this.isJumpingLogout = false;
                            console.log('Logout Cancel Pressed');
                        }, style: 'cancel'},
                    {
                        text: '确定',
                        onPress: () => {
                            this.isJumpingLogout = false;

                        },
                    },]
                , {cancelable: false});
        }
    }

    /**
     * 退出登录并跳转到首页, 不进行任何确认
     * @param navigator React Native Navigation navigator object
     */
    doLogout(navigator) {
        if(navigator) {
            //删除jpush别名和标签
            JPushModule.cleanTags(function () {
                console.log('标签清除成功')
            });
            JPushModule.deleteAlias(function () {
                console.log('别名清除成功')

            });
            DeviceEventEmitter.emit('ClearMessage');  //清空消息列表与未读消息数

            //删除本地存储信息
            UserInfoStore.removeCompany().then();
            UserInfoStore.removeCompanyArr().then();
            UserInfoStore.removeLastUserPhone().then();
            UserInfoStore.removeApplyPay().then();
            UserInfoStore.removeUserInfo().then(
                v => {
                    UserInfoStore.removeCompany().then(
                        v => {
                            if (navigator) {
                                console.log("popToRoot");
                                DeviceEventEmitter.emit('ChangeCompany');
                                navigator.popToRoot();
                                if(Platform.OS === 'android'){
                                    navigator.switchToTab({
                                        tabIndex: 0
                                    });
                                }
                            }
                        },
                        e => {
                            if (navigator) {
                                console.log("popToRoot");
                                navigator.popToRoot();
                                if(Platform.OS === 'android'){
                                    navigator.switchToTab({
                                        tabIndex: 0
                                    });
                                }
                            }
                        }
                    );
                },
                e => {
                    if (navigator) {
                        console.log("popToRoot");
                        navigator.popToRoot();
                        if(Platform.OS === 'android'){
                            navigator.switchToTab({
                                tabIndex: 0
                            });
                        }

                    }
                }
            );

            if(Platform.OS === 'ios'){
                // 转到首页标签
                navigator.switchToTab({
                    tabIndex: 0
                });
            }
        }
    }
}

global.loginJumpSingleton = new LoginJumpSingleton();// 全局可用