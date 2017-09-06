/**
 * Created by edianzu on 2017/6/6.
 */

import React, {Component} from 'react';
import {DeviceEventEmitter, Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

import px2dp from '../util'
import * as apis from '../apis';
import DeviceInfo from 'react-native-device-info';
import Alert from "react-native-alert";
// 获取屏幕尺寸
const {width, height} = Dimensions.get('window');

export default class PLPMine extends Component {
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '-',     // 用户名
        };

        this._doLogout = this._doLogout.bind(this);
        this._updateUserData = this._updateUserData.bind(this);
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('loginSuccess', (data) => {
            console.log('我的 loginSuccess');
            try {
                this._updateUserData();
            } catch (e) {
                console.log(e + "");
            }
        });
    }

    // 准备加载组件
    componentWillMount() {
        try {
            // 启动时载入一次用户信息
            this._updateUserData();
        } catch (e) {
            console.log(e + "");
        }
    }


    componentWillUnmount() {
        // 销毁
        this.subscription.remove();
    }

    _updateUserData() {
        UserInfoStore.getUserInfo().then(
            (user) => {
                console.log("用户信息读取返回:" , JSON.stringify(user));
                if (user !== null) {
                    this.setState({userName: user.name});
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../img/bg.png')} style={styles.head_background}>
                    <TouchableWithoutFeedback onPress={() => {
                        this._goPersonalInfo()
                    }}>
                        <View style={styles.headimagestyle}>
                            <Image source={require('../img/logo_circle.png')} style={styles.headPortraint}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={styles.textname}>{this.state.userName}</Text>
                    <Text style={styles.textcontentview}>{/* 暂无部门信息*/}</Text>
                </Image>

                <TouchableWithoutFeedback onPress={() => {
                    this._goSettings()
                }}>
                    <View style={styles.settingview}>
                        <Image source={require('../img/set.png')}
                               style={styles.imgiconview}/>
                        <Text style={styles.listtextstyle}>
                            设置
                        </Text>
                        <Image source={{uri: 'icon_cell_rightArrow'}} style={styles.arrowStyle}/>
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.lineview}/>

                <TouchableWithoutFeedback onPress={() => {
                    this._goFeedback()
                }}>
                    <View style={styles.settingview}>
                        <Image source={require('../img/problem.png')}
                               style={styles.imgiconview}/>
                        <Text style={styles.listtextstyle}>
                            问题反馈
                        </Text>
                        <Image source={{uri: 'icon_cell_rightArrow'}} style={styles.arrowStyle}/>
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.lineview}/>

                <TouchableWithoutFeedback onPress={() => {
                    this._goAbout()
                }}>
                    <View style={styles.settingview}>
                        <Image source={require('../img/about.png')}
                               style={styles.imgiconview}/>
                        <Text style={styles.listtextstyle}>
                            关于噼里啪v{DeviceInfo.getVersion()}
                        </Text>
                        <Image source={{uri: 'icon_cell_rightArrow'}} style={styles.arrowStyle}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.lineviewlast}/>

                <TouchableWithoutFeedback onPress={() => {
                    this._doLogout()
                }}>
                    <View style={styles.buttonView}>
                        <Text style={styles.submitButtonText}>退出</Text>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        );
    }

    // 登出
    _doLogout() {
        Alert.alert('确定退出', '',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: '确定',
                    onPress: () => {
                        UserInfoStore.getJPushID().then(
                            v => {
                                apis.unbindJPush(v).then(
                                    (responseData) => {
                                        console.log("jpush 解除绑定成功")
                                        this._doLogoutCall();
                                    },
                                    (e) => {
                                        console.log("jpush 解除绑定失败")
                                        this._doLogoutCall();
                                    }
                                );
                            },
                            e =>  {
                                console.log(e.message)
                                this._doLogoutCall();
                            }
                        );
                    },
                },]
            , {cancelable: false});
    }

    _doLogoutCall() {
        apis.logout().then(
            () => {
                loginJumpSingleton.goToLogin(this.props.navigator);
                // navToBootstrap({isReset: true})
                // DeviceEventEmitter.emit('goLoginPage', true);
                // this.props.navigator.push({
                //     screen: 'user.LoginPage',
                //     backButtonTitle: '', // 返回按钮的文字 (可选)
                //     backButtonHidden: false, // 是否隐藏返回按钮 (可选)
                //     title:'Login',
                // });
            },
            (e) => {
                loginJumpSingleton.goToLogin(this.props.navigator);
                // navToBootstrap({isReset: true})
                //Toast.show("退出失败:" + e.msg) TOKEN 无效无法退出会成死循环逻辑
            }
        )
    }


    _goPersonalInfo() {
        this.props.navigator.push({
            screen: 'pilipaMain.my.PersonalInfo',
            backButtonTitle: '', // 返回按钮的文字 (可选)
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            title: '个人资料',
        });
    }

    _goFeedback() {
        this.props.navigator.push({
            screen: 'pilipaMain.my.Feedback',
            backButtonTitle: '', // 返回按钮的文字 (可选)
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            title: '问题反馈',
        });
    }

    _goAbout() {
        this.props.navigator.push({
            screen: 'pilipaMain.my.About',
            backButtonTitle: '', // 返回按钮的文字 (可选)
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            title: '关于噼里啪',
        });
    }

    _goSettings() {
        this.props.navigator.push({
            screen: 'pilipaMain.my.Settings',
            backButtonTitle: '', // 返回按钮的文字 (可选)
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            title: '设置',
        });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        flex: 1,
    },
    navbarTitleItemStyle: {
        fontSize: 17,
        color: 'black',
        marginRight: 50
    },
    head_background: {
        height: height / 3,
        width: width,
    },
    headimagestyle: {
        width: width,
        height: 80,
        position: 'absolute',
        bottom: 87,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headPortraint: {
        position: 'absolute',
        height: 80,
        width: 80,
    },
    textname: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 18,
        position: 'absolute',
        bottom: 47,
        width: width,
        textAlign: 'center',
    },
    textcontentview: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 12,
        position: 'absolute',
        bottom: 25,
        width: width,
        textAlign: 'center',
    },
    settingview: {
        height: 50,
        width: width,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    imgiconview: {
        marginLeft: 15,
        alignItems: 'center',
        marginRight: 10,
    },
    lineview: {
        backgroundColor: '#dedede',
        marginLeft: 15,
        height: 0.5,
    },
    lineviewlast: {
        backgroundColor: '#dedede',
        height: 0.5,
    },
    listtextstyle: {
        fontSize: 15,
        color: '#323232',
        alignItems: 'center',
        position: 'absolute',
        marginLeft: 45,
    },
    arrowStyle: {
        width: 10,
        height: 10,
        marginRight: 15,
    },
    buttonView: {
        borderColor: '#e6272e',
        margin: 0,
        borderWidth: 1.5,
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        height: px2dp(88),
        width: px2dp(500),
        bottom: px2dp(45),
        position: 'absolute'
    },
    submitButtonText: {
        fontSize: 30 / 2,
        color: '#e6272e',
        textAlign: 'center',
    },

});



