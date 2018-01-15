/**
 * Created by jinglan on 2018/1/12.
 */
/**
 * Created by jinglan on 2018/1/12.
 */

import React, {Component} from 'react';
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
import Swipeout from "react-native-swipeout"
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
import Toast from 'react-native-root-toast';

import RefreshListView, {RefreshState} from '../../view/RefreshListView'
export default class NotifyMessagePage extends BComponent {

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
        tabBarHidden: true, // 默认隐藏底部标签栏
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

                    if (this.state.jpushMessage) {
                        pushJump(this.props.navigator, this.state.jpushMessage.url,this.state.jpushMessage.title?this.state.jpushMessage.title:'噼里啪智能财税',this.state.jpushMessage.title?this.state.jpushMessage.title:'噼里啪智能财税'.title,this.state.jpushMessage.content);

                        this.setState({
                            jpushMessage: ''
                        });
                    }
                }
            }
            this._clearUnreadedNum();
        }

        if(event.id === 'willDisappear'){
            this.setState({
                isAppear : false
            })
        }
    }

    componentDidMount() {
        this.refreshListData();


        this.refreshEmitter = DeviceEventEmitter.addListener('ReloadMessage', () => {
            //收到登录后的通知需要刷新消息页面
            this.onHeaderRefresh();
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
                this.onHeaderRefresh()
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
                this.onHeaderRefresh()
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
                    this.onHeaderRefresh()
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
                    this.onHeaderRefresh()
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







    _clearUnreadedNum(){
        //TODO 这里清空通知消息数量
        return;

        if (this.state.unReadNum === 0){
            return;
        }

        this.props.navigator.setTabBadge({
            badge: null
        });

        if(!NetInfoSingleton.isConnected) {
            return;
        }

        apis.putClearMessageUnReadedNum().then(
            (responseData) => {

                if(responseData.code === 0){
                    this.setState({
                        unReadNum:0,
                    });
                    this.props.navigator.setTabBadge({
                        badge: null
                    });

                }else{
                }
            },
            (e) => {

            },
        );
    }




    refreshListData(){
        console.log("tmpArr嘎嘎嘎到这里000");

        UserInfoStore.getNotifyMessageArr().then(
            (messageArr) => {

                console.log("tmpArr嘎嘎嘎到这里:",messageArr);

                if (messageArr) {

                    if (messageArr.length > 0){
                        this.setState({
                            initStatus:'initSucess',
                            dataList : messageArr,
                            refreshState : RefreshState.NoMoreData,
                        });
                    }else if (messageArr.length === 0){
                        this.setState({
                            initStatus:'no-data'
                        })
                    }
                }
            },
            (e) => {

                this.setState({
                    initStatus:'error'
                })

            },
        );
    }



    _jumpWithUrl(item){

        pushJump(this.props.navigator, item.url,item.title?item.title:'噼里啪智能财税',item.title?item.title:'噼里啪智能财税',item.content);
    }

    _readed(item){

        if (item.readed === true){
            return;
        }


        item.readed = true;
        let data = [];
        this.state.dataList.forEach(row => {
            data.push(Object.assign({}, row));
        });

        this.setState({
            dataList:data,
        });
    }

    _goto(item){

        this.props.navigator.push({
            screen: 'SystemMessagePage',
            title:'消息详情',
            passProps:{
                item
            }
        });
    }

    renderCell = (info) => {
        return(
            <TouchableOpacity onPress={this._jumpWithUrl.bind(this,info.item)}>
                <MessageCustomCell
                    messageTitle={info.item.title}
                    messageSubTitle={info.item.content}
                    messageTime={info.item.createDate}
                    isRead={false}
                />
            </TouchableOpacity>
        )
    };

    render() {

        if(this.state.initStatus === 'initSucess') {
            return (
                <View style={styles.container}>
                    <RefreshListView
                        data={this.state.dataList}
                        keyExtractor = {(item, index) => index}
                        renderItem={this.renderCell.bind(this)}
                        refreshState={this.state.refreshState}
                        contentContainerStyle={{paddingTop:10,backgroundColor:'#f1f1f1'}}
                        isheaderrefresh={false}
                    />
                </View>
            )
        }else {
            return(
                <DefaultView  type ={this.state.initStatus}/>
            )
        }

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
