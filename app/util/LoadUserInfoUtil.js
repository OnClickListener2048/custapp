/**
 * Created by zhuangzihao on 2018/1/15.
 */
import * as apis from '../apis';
import JPushModule from 'jpush-react-native'
import Alert from "react-native-alert";
import Toast from 'react-native-root-toast';
import {DeviceEventEmitter} from "react-native";
var LoadUserInfoCallBack = {
    type:'bind',//bind 绑定手机号时  login登录时
    callback: function(code){
        //0:用户信息公司信息读取成功读取成功
    }
}
//用户信息公司信息读取成功
var successCode= {
    code:0,//0代表成功
    userType:0 //0没绑定过手机号 1绑定过手机号没公司 2绑定过手机号有公司
}

var failedCode = {
    code:-1,//数据请求失败
    failedType:0 //0 获取用户信息失败 1 获取公司信息失败
}

export default function loadUserInfo(LoadUserInfoCallBack){

    let loading;

    if(LoadUserInfoCallBack.type && (LoadUserInfoCallBack.type == 'login')){
        loading = SActivityIndicator.show(true, "载入中...");
    }

    apis.userInfo().then(
        (responseData) => {
            SActivityIndicator.hide(loading);

            console.log("用户信息读取成功返回:", JSON.stringify(responseData));
            if (responseData && responseData.user) {
                if(responseData.user.username){
                    let alias = responseData.user.username.replace(/-/g, "_")
                    JPushModule.setAlias(alias,function () {
                        console.log('绑定成功',alias)
                    },function () {
                        console.log('绑定失败')
                    })

                }
                if(responseData.user.group){
                    JPushModule.setTags(responseData.user.group,function () {
                        console.log('设置分组成功')
                    },function () {
                        console.log('设置分组失败')
                    })
                }
                // responseData.user.mobilePhone = '15566667777';// 调试
                if (responseData.user.mobilePhone) {
                    //responseData.user.mobilePhone = '18888888888';
                    UserInfoStore.setLastUserPhone(responseData.user.mobilePhone).then();
                    UserInfoStore.setUserInfo(responseData.user).then();
                    //修改这个参数得到公司信息数据 responseData.user.mobilePhone   '18099990000' responseData.user.mobilePhone
                    let loading;

                    if(LoadUserInfoCallBack.type && (LoadUserInfoCallBack.type == 'login')){
                        loading = SActivityIndicator.show(true, "读取公司信息中...")
                    }
                    apis.getCompany(responseData.user.mobilePhone).then(
                        (companyInfo) => {
                            console.log("公司信息读取返回", companyInfo);
                            SActivityIndicator.hide(loading);
                            // this.setState({loading: false});
                            if (companyInfo && companyInfo.list && companyInfo.list.length >0) {

                                console.log("公司信息读取成功返回:", JSON.stringify(companyInfo));

                                let tmpCompaniesArr = companyInfo.list;

                                if (companyInfo.applypay) {
                                    UserInfoStore.setApplyPay(JSON.stringify(companyInfo.applypay)).then();
                                }

                                UserInfoStore.setCompanyArr(tmpCompaniesArr).then();
                                let index = -1;
                                for(let i=0;i<tmpCompaniesArr.length;i++){
                                    let dic = tmpCompaniesArr[i]
                                    if(dic.default){
                                        index = i;
                                        break;
                                    }
                                }

                                // 如果服务端没有返回默认公司, 就在这里设置为第0个, 然后发回服务端进行更新
                                if(index === -1) {
                                    index = 0;
                                    if(tmpCompaniesArr && tmpCompaniesArr[index]) {
                                        apis.changeCompany(tmpCompaniesArr[index].id).then(
                                            (responseData) => {
                                                console.log('自动设置默认公司成功', responseData);
                                            },
                                            (e) => {
                                                console.log('自动设置默认公司失败');
                                            },
                                        );
                                    }
                                }

                                UserInfoStore.setCompany(tmpCompaniesArr[index]).then();

                                successCode.code = 0;
                                successCode.userType = 2;
                                LoadUserInfoCallBack.callback(successCode)
                            } else {
                                UserInfoStore.removeCompany().then();
                                UserInfoStore.removeCompanyArr().then();
                                UserInfoStore.removeApplyPay().then();
                                successCode.code = 0;
                                successCode.userType = 1;
                                LoadUserInfoCallBack.callback(successCode)
                            }
                            // this.pop();

                        },
                        (e) => {
                            SActivityIndicator.hide(loading);
                            // this.setState({loading: false});
                            UserInfoStore.removeCompany().then();
                            UserInfoStore.removeCompanyArr().then();
                            UserInfoStore.removeApplyPay().then();
                            failedCode.code = -1
                            failedCode.failedType = 1
                            LoadUserInfoCallBack.callback(failedCode)
                            console.log("公司信息读取错误返回:", e);
                            Toast.show('公司信息读取失败', {
                                position: Toast.positions.CENTER,
                                duration: Toast.durations.LONG,
                                backgroundColor: 'red'
                            });
                            // this.pop();
                        },
                    );
                } else {
                    // this.setState({loading: false});
                    // 没有手机号, 强制转往绑定手机页面
                    UserInfoStore.removeLastUserPhone().then();
                    UserInfoStore.setUserInfo(responseData.user).then();
                    // 保存成功后再跳转
                    // this.props.navigator.push({
                    //     screen: 'FirstBindPhonePage',
                    //     title: ''
                    // });
                    successCode.code = 0;
                    successCode.userType = 0
                    LoadUserInfoCallBack.callback(successCode)
                }


            } else {
                Alert.alert("用户信息返回为空, 请重试", JSON.stringify(responseData));
                // this.setState({loading: false});
                failedCode.code = -1
                failedCode.failedType = 0
                LoadUserInfoCallBack.callback(failedCode)
            }
        },
        (e) => {
            SActivityIndicator.hide(loading);
            // this.setState({loading: false});
            console.log("用户信息读取错误返回:", e);
            Toast.show('用户信息读取失败' + errorText(e), {
                position: Toast.positions.CENTER,
                duration: Toast.durations.LONG,
                backgroundColor: 'red'
            });
            failedCode.code = -1
            failedCode.failedType = 0
            LoadUserInfoCallBack.callback(failedCode)

        },
    );


}
