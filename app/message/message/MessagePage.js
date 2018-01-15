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
            notifyNewNum: 0,
            serviceNewNum: 0,
            logined : false,
            isAppear : false,
            isGotoSubVC : false,
            refreshState: RefreshState.Idle,
            jpushMessage:'',
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
        };
        this.page =1;
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this._setNotifyCellNewNum = this._setNotifyCellNewNum.bind(this);
        this._setServiceCellNewNum = this._setServiceCellNewNum.bind(this);
        this._resetNotifyNum = this._resetNotifyNum.bind(this);
        this._resetServiceNum = this._resetServiceNum.bind(this);


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

            this.setState({
                isGotoSubVC : false,
            });

            if (this.state.isAppear === false){
                this.setState({
                    isAppear : true
                });
                if(Platform.OS === 'ios') {

                    // console.log('嘎嘎嘎1', this.state.jpushMessage, this.state.jpushMessage.length, this.state.jpushMessage.length > 0)
                    if (this.state.jpushMessage) {

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


            if (this.state.isGotoSubVC === false){
                this.setState({
                    isAppear : false
                })
            }
        }

    }
    componentDidMount() {

        //打开即可
        if(NetInfoSingleton.isConnected) {
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

                //两种cell新消息数字 加入缓存数据
                this._resetNotifyMessageArr(message);
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
                this._resetNotifyMessageArr(message);

            });

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

            //应用未杀死 点击通知栏
            this.clickiOSjpushEvent = JPushModule.addReceiveOpenNotificationListener((message) => {
                console.log("点击击通知自测通知自测 " + JSON.stringify(message));
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
                    this._resetNotifyMessageArr(message.extras);

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
                    this._resetNotifyMessageArr(message.extras);

                });

                //点击通知栏
                this.clickAndroidjpushEvent = JPushModule.addReceiveOpenNotificationListener((message) => {
                    console.log("点击击通知自测通知自测 " + JSON.stringify(message));

                    let obj = JSON.parse(message.extras)
                    this._timer = setTimeout(() => {

                        if(NavigatorSelected){
                            pushJump(NavigatorSelected, obj.url,obj.url,obj.title,obj.title,obj.content);
                        }
                        clearTimeout(this._timer);
                    }, 500);


                });
            });
        }
    }





    _resetNotifyNum(){
        UserInfoStore.getNotifyMessageNewNum().then(
            (num) => {
                if (num) {
                    this._setNotifyCellNewNum(num + 1);
                    UserInfoStore.setNotifyMessageNewNum(num + 1).then(
                        (num) => {
                        },
                        (e) => {
                        },
                    );
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    _resetServiceNum(){
        UserInfoStore.getServiceMessageNewNum().then(
            (num) => {
                if (num) {
                    this._setServiceCellNewNum(num + 1);
                    UserInfoStore.setServiceMessageNewNum(num + 1).then(
                        (num) => {
                        },
                        (e) => {
                        },
                    );
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    _resetNotifyMessageArr(item){
        //服务类的
        if(item.isGroup === false) {
            this._resetServiceNum();
        }else if (item.isGroup === true) {
            //通知类的
            this._resetNotifyNum();

            let tmpArr = [];
            tmpArr[0] = item;

            UserInfoStore.getNotifyMessageArr().then(
                (messageArr) => {
                    if (messageArr) {

                        if (messageArr.length > 0) {
                            this.messageArr.forEach(row => {
                                tmpArr.push(Object.assign({}, row));
                            });
                        }

                        UserInfoStore.setNotifyMessageArr(tmpArr).then(
                            (newList) => {
                                console.log("保存数据成功嘎嘎嘎:", newList);
                            },
                            (e) => {
                            },
                        );


                        UserInfoStore.setNotifyMessageNewNum(tmpArr.length).then(
                            (newList) => {

                                console.log("保存新的通知消息长度成功嘎嘎嘎:");

                            },
                            (e) => {
                            },
                        );
                    }
                },
                (e) => {
                    console.log("读取信息错误:", e);
                },
            );
        }
    }

    _isLogined(){
        UserInfoStore.isLogined().then(
            logined => {
                this.setState({logined:logined});
                if (logined === true){
                    this._loadUnreadedNum()
                }else {
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



    //不在本页的情况下请求这个接口 显示tabBadge
    _loadUnreadedNum(){

        if(!NetInfoSingleton.isConnected) {
            return;
        }

        apis.loadMessageUnReadedNum().then(
            (responseData) => {

                if(responseData.code === 0){

                    UserInfoStore.getNotifyMessageNewNum().then(
                        (num) => {
                            if (num) {
                                this.setState({
                                    unReadNum:responseData.unread + num,
                                });

                                this.props.navigator.setTabBadge({
                                    badge: this.state.unReadNum + num <= 0 ? null : this.state.unReadNum + num// 数字气泡提示, 设置为null会删除
                                });

                            }
                        },
                        (e) => {
                            console.log("读取信息错误:", e);
                        },
                    );




                    UserInfoStore.setServiceMessageNewNum(responseData.unread).then(
                        (num) => {

                        },
                        (e) => {
                        },
                    );

                }else{
                }
            },
            (e) => {

            },
        );
    }

    _clearNotifyMessageNum(){

    }

    _clearServiceMessageNum(){

    }




    _gotoServiceMessagePage(){
        UserInfoStore.setServiceMessageNewNum(0).then(
            (num) => {

                this._setServiceCellNewNum(0);

                this.setState({
                    isGotoSubVC : true,
                    serviceNewNum : 0
                });

                this.push({
                    screen: 'ServiceMessagePage',
                    title:'服务消息',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    callback: this._clearServiceMessageNum.bind(this),
                });
            },
            (e) => {
            },
        );

    }

    _setServiceCellNewNum(num){
        if(this.refs.serviceCell) {
            this.refs.serviceCell.setNewNum(num);
        }
    }

    _setNotifyCellNewNum(num){
        if(this.refs.notifyCell) {
            this.refs.notifyCell.setNewNum(num);
        }
    }

    _gotoNotifyMessagePage(){
        UserInfoStore.setNotifyMessageNewNum(0).then(
            (num) => {
                this.setState({
                    isGotoSubVC : true,
                    notifyNewNum:3
                });


                this._setNotifyCellNewNum(0);


                this.push({
                    screen: 'NotifyMessagePage',
                    title:'通知助手',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    callback: this._clearNotifyMessageNum.bind(this),
                });
            },
            (e) => {
            },
        );
    }

    render() {

            return (
                <View style={styles.container}>
                    <MessageTipCell ref="notifyCell"
                        onPress={this._gotoNotifyMessagePage.bind(this)}
                        underLine={true}
                        isClick ={true}
                        isRightBtnClick ={true}
                        leftIcon = {require('../../img/notifyMessageIcon.png')}
                        leftText= {'通知助手'}
                        messageNum={this.state.serviceNewNum}
                    />
                    <MessageTipCell ref="serviceCell"
                        onPress={this._gotoServiceMessagePage.bind(this)}
                        underLine={false}
                        isClick ={true}
                        isRightBtnClick ={true}
                        leftIcon = {require('../../img/serviceMessageIcon.png')}
                        leftText= {'服务消息'}
                        messageNum={this.state.notifyNewNum}
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