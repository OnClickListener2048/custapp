/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {navToMainTab} from '../../navigation';
import pushJump from '../../util/pushJump';

import {
    View,
    TouchableOpacity,
    Text,
    Platform,
    DeviceEventEmitter,
    NativeAppEventEmitter,
    StyleSheet
} from 'react-native';
import MessageCustomCell from './MessageCell'
import JPushModule from 'jpush-react-native';
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
import MessageTipCell from './MessageTipCell';
import RefreshListView, {RefreshState} from '../../view/RefreshListView'

export default class MessagePage extends BComponent {

    constructor(props) {
        super(props);

        this.state = {
            dataList: [],
            unReadNum: 0,
            logined : false,
            isAppear : false,
            refreshState: RefreshState.Idle,
            jpushMessage:'',
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
        };
        this.page =1;
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };



    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
         // console.log('ApplicationCenterPage event.type', event.type);
        //console.log('ApplicationCenterPage event.type', event.id);
        super.onNavigatorEvent(event)
        if (event.id === 'willAppear') {
            if(NavigatorSelected || NavigatorSelected)
            NavigatorSelected = this.props.navigator;
        }
        if(event.id === 'didAppear'){


            if(Platform.OS === 'ios') {
                JPushModule.setBadge(0, (badgeNumber) => {
                });
            }

            if (this.state.isAppear === false){
                this.setState({
                    isAppear : true
                });
                if(Platform.OS === 'ios') {

                    // console.log('嘎嘎嘎1', this.state.jpushMessage, this.state.jpushMessage.length, this.state.jpushMessage.length > 0)
                    if (this.state.jpushMessage) {
                        // console.log('嘎嘎嘎2', this.state.jpushMessage, this.state.jpushMessage.length, this.state.jpushMessage.length > 0)

                        pushJump(this.props.navigator, this.state.jpushMessage.url,this.state.jpushMessage.title?this.state.jpushMessage.title:'噼里啪智能财税',this.state.jpushMessage.title?this.state.jpushMessage.title:'噼里啪智能财税'.title,this.state.jpushMessage.content);

                        this.setState({
                            jpushMessage: ''
                        });


                    }
                }
            }


            this._clearBadgeNum();

        }



        if(event.id === 'willDisappear'){
            this.setState({
                isAppear : false
            })

        }

    }
    componentDidMount() {

        //打开即可
        if(!NetInfoSingleton.isConnected) {
            this.setState({
                initStatus:'no-net'
            })
        }else{
            this._isLogined();
        }

        this.refreshEmitter = DeviceEventEmitter.addListener('ReloadMessage', () => {
            //如果在消息页面则不显示badge红点提示,否则要在消息的tab显示红点数字提示
            if (this.state.isAppear === true){
                this.props.navigator.setTabBadge({
                    badge: null
                });
            }else {
                this._loadUnreadedNum();
            }
        });

        this.refreshEmitter = DeviceEventEmitter.addListener('ClearMessage', () => {
            //收到退出后的通知需要清空消息页面,并置badge为空不提示红点
            this.props.navigator.setTabBadge({
                badge: null
            });
            this.setState({
                initStatus:'no-data'
            })
        });



        //notifyJSDidLoad  新版本安卓如下写法才可监听到消息回调
        if(Platform.OS === 'ios'){


            //应用杀死 点击通知跳转
            this.refreshEmitter = DeviceEventEmitter.addListener('ClickJPushMessage', (message) => {
                this.setState({
                    jpushMessage : message
                });
                this.props.navigator.switchToTab({
                    //因为应用杀死的情况下直接点开不会走viewwillAppear,所以强制跳转到本页面走viewwillAppear然后在viewwillAppear执行相关操作
                    tabIndex: 2
                });
            });
            //收到自定义消息 刷新消息
            this.recieveiOSCustomJPushEvent = JPushModule.addReceiveCustomMsgListener((message) => {
                console.log("receive notification: " + JSON.stringify(message));
                //每收到一次消息都刷新消息列表,并根据是否当前在消息页面控制底部badge是否显示
                if (this.state.isAppear === true){
                    this.props.navigator.setTabBadge({
                        badge: null
                    });
                }else {
                    this._loadUnreadedNum();
                }
            });

            //收到通知刷新自定义消息
            this.recieveiOSJPushEvent = JPushModule.addReceiveNotificationListener((message) => {
                console.log("receive notification: " + JSON.stringify(message));
                if (this.state.isAppear === true){
                    this.props.navigator.setTabBadge({
                        badge: null
                    });
                }else {
                    this._loadUnreadedNum();
                }
            });
            //应用未杀死 点击通知栏
            this.clickiOSjpushEvent = JPushModule.addReceiveOpenNotificationListener((message) => {
                console.log("点击击通知自测通知自测 " + JSON.stringify(message));

                // this.props.navigator.switchToTab({
                //     tabIndex: 2
                // });

                // pushJump(this.props.navigator, message.url);
                if(NavigatorSelected){
                    pushJump(NavigatorSelected, message.url,message.title?message.title:'噼里啪智能财税',message.title?message.title:'噼里啪智能财税',message.content);

                }

            });

        }else{
            JPushModule.notifyJSDidLoad(() => {
                //收到自定义消息
                this.recieveAndroidCustomJPushEvent = JPushModule.addReceiveCustomMsgListener((message) => {
                    console.log("receive notification: " + JSON.stringify(message));
                    if (this.state.isAppear === true){
                        this.props.navigator.setTabBadge({
                            badge: null
                        });
                    }else {
                        this._loadUnreadedNum();

                    }
                });
                //收到通知
                this.recieveAndroidJPushEvent = JPushModule.addReceiveNotificationListener((message) => {
                    console.log("receive notification: " + JSON.stringify(message));
                    if (this.state.isAppear === true){
                        this.props.navigator.setTabBadge({
                            badge: null
                        });
                    }else {
                        this._loadUnreadedNum();
                    }
                });

                //点击通知栏
                this.clickAndroidjpushEvent = JPushModule.addReceiveOpenNotificationListener((message) => {
                    console.log("点击击通知自测通知自测 " + JSON.stringify(message));

                    let obj = JSON.parse(message.extras)
                    this._timer = setTimeout(() => {
                        // this.props.navigator.switchToTab({
                        //     tabIndex: 2
                        // });
                        // pushJump(this.props.navigator, obj.url);
                        if(NavigatorSelected){
                            pushJump(NavigatorSelected, obj.url,obj.url,obj.title,obj.title,obj.content);
                        }
                        clearTimeout(this._timer);
                    }, 500);


                });
            });
        }
    }



    _isLogined(){
        UserInfoStore.isLogined().then(
            logined => {
                this.setState({logined:logined});
                console.log('MinePage logined', logined,this.state.logined);

                if (logined === true){
                    this._loadUnreadedNum()
                }else {
                    this.setState({
                        initStatus:'no-data'
                    });
                    this.props.navigator.setTabBadge({
                        badge: null
                    });
                }
            },
            e => {

            }
        );
    }




    _clearBadgeNum(){

        if (this.state.unReadNum === 0){
            return;
        }

        this.props.navigator.setTabBadge({
            badge: null
        });

    }


    //TODO 通知消息数量加服务消息数量自己算
    _loadUnreadedNum(){

        if(!NetInfoSingleton.isConnected) {
            return;
        }

        apis.loadMessageUnReadedNum().then(
            (responseData) => {

                if(responseData.code === 0){


                    this.setState({
                        unReadNum:responseData.unread,
                    });

                    this.props.navigator.setTabBadge({
                        badge: this.state.unReadNum <= 0 ? null : this.state.unReadNum // 数字气泡提示, 设置为null会删除
                    });


                }else{
                }
            },
            (e) => {

            },
        );
    }

    _gotoServiceMessagePage(){
        this.push({
            screen: 'ServiceMessagePage',
            title:'服务消息',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
        });
    }

    _gotoNotifyMessagePage(){
        this.push({
            screen: 'ServiceMessagePage',
            title:'通知助手',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
        });
    }

    render() {

            return (
                <View style={styles.container}>
                    <MessageTipCell
                        onPress={this._gotoNotifyMessagePage.bind(this)}
                        underLine={true}
                        isClick ={true}
                        isRightBtnClick ={true}
                        leftIcon = {require('../../img/notifyMessageIcon.png')}
                        leftText= {'通知助手'}
                    />
                    <MessageTipCell
                        onPress={this._gotoServiceMessagePage.bind(this)}
                        underLine={false}
                        isClick ={true}
                        isRightBtnClick ={true}
                        leftIcon = {require('../../img/serviceMessageIcon.png')}
                        leftText= {'服务消息'}
                    />

                </View>
            )
        // }else {
        //     return(
        //         <DefaultView onPress={()=>this._reloadPage()} type ={this.state.initStatus}/>
        //     )
        // }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS == 'ios' ? 20 : 0,
        backgroundColor:'#F1F1F1'
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
});