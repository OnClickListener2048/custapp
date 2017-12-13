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
import Swipeout from "react-native-swipeout"
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
import Toast from 'react-native-root-toast';

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
        if(event.id === 'willAppear'){
            this.setState({
                isAppear : true
            })
            this._clearUnreadedNum();

        }

        if(event.id === 'willDisappear'){
            this.setState({
                isAppear : false
            })

        }

    }




    componentDidMount() {
        var self = this;
        // JPushModule.setAlias('f3d54ae6_db20_49dd_92f6_db4140aab633',function () {
        //     console.log('绑定成功','f3d54ae6_db20_49dd_92f6_db4140aab633')
        // },function () {
        //     console.log('绑定失败')
        // })

        // console.log("点击击通知自测通知自测 " + JSON.stringify(message));
        // let a = message.url.replace('"','')
        //
        // this.props.navigator.switchToTab({
        //     tabIndex: 2
        // });
        // pushJump(this.props.navigator, a);



        //打开即可
        if(!NetInfoSingleton.isConnected) {
            this.setState({
                initStatus:'no-net'
            })
        }else{
            this._isLogined();
        }

        this.refreshEmitter = DeviceEventEmitter.addListener('ReloadMessage', () => {
            this.onHeaderRefresh();
            if (this.state.isAppear === true){
                this.props.navigator.setTabBadge({
                    badge: null
                });
            }else {
                self._loadUnreadedNum();

            }
        });

        this.refreshEmitter = DeviceEventEmitter.addListener('ClearMessage', () => {
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


                this.props.navigator.switchToTab({
                    tabIndex: 2
                });
                pushJump(this.props.navigator, message.url);
            });
            //收到自定义消息 刷新消息
            self.recieveiOSCustomJPushEvent = JPushModule.addReceiveCustomMsgListener((message) => {
                console.log("receive notification: " + JSON.stringify(message));
                if (this.state.isAppear === true){
                    this.props.navigator.setTabBadge({
                        badge: null
                    });
                }else {
                    self._loadUnreadedNum();
                }
                self.onHeaderRefresh()
            });

            //收到通知刷新自定义消息
            self.recieveiOSJPushEvent = JPushModule.addReceiveNotificationListener((message) => {
                console.log("receive notification: " + JSON.stringify(message));
                if (this.state.isAppear === true){
                    this.props.navigator.setTabBadge({
                        badge: null
                    });
                }else {
                    self._loadUnreadedNum();
                }
                self.onHeaderRefresh()
            });
            //应用未杀死 点击通知栏
            self.clickiOSjpushEvent = JPushModule.addReceiveOpenNotificationListener((message) => {
                console.log("点击击通知自测通知自测 " + JSON.stringify(message));


                this.props.navigator.switchToTab({
                    tabIndex: 2
                });
                pushJump(this.props.navigator, message.url);

            });

        }else{
            JPushModule.notifyJSDidLoad(() => {
                //收到自定义消息
                self.recieveAndroidCustomJPushEvent = JPushModule.addReceiveCustomMsgListener((message) => {
                    console.log("receive notification: " + JSON.stringify(message));
                    if (this.state.isAppear === true){
                        this.props.navigator.setTabBadge({
                            badge: null
                        });
                    }else {
                        self._loadUnreadedNum();

                    }
                    self.onHeaderRefresh()
                });
                //收到通知
                self.recieveAndroidJPushEvent = JPushModule.addReceiveNotificationListener((message) => {
                    console.log("receive notification: " + JSON.stringify(message));
                    if (this.state.isAppear === true){
                        this.props.navigator.setTabBadge({
                            badge: null
                        });
                    }else {
                        self._loadUnreadedNum();
                    }
                    self.onHeaderRefresh()
                });
                //点击通知栏
                self.clickAndroidjpushEvent = JPushModule.addReceiveOpenNotificationListener((message) => {
                    console.log("点击击通知自测通知自测 " + JSON.stringify(message));
                    let obj = JSON.parse(message.extras)

                    this.props.navigator.switchToTab({
                        tabIndex: 2
                    });
                    pushJump(this.props.navigator, obj.url);


                });
            });
        }





    }


    _isLogined(){
        UserInfoStore.isLogined().then(
            logined => {
                console.log('MinePage logined', logined);
                this.setState({logined:logined});
                if (logined === true){
                    this.onHeaderRefresh();
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




    _clearUnreadedNum(){

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


    loadData(page=1,pageSize=10){


        if(!NetInfoSingleton.isConnected) {
           return;
        }

        if(page===1){
            this.setState({refreshState: RefreshState.HeaderRefreshing})

        }else{
            this.setState({refreshState: RefreshState.FooterRefreshing})
        }

        apis.loadMessageData(pageSize,page).then(
            (responseData) => {

                if(responseData.code === 0){
                    let newList = responseData.list;

                    let dataList = page === 1 ? newList : [...this.state.dataList, ...newList]
                    this.setState({
                        dataList: dataList,
                        refreshState:responseData.list.length < pageSize ? RefreshState.NoMoreData : RefreshState.Idle,
                    });

                    if (page === 1 && this.state.dataList.length === 0){

                        this.setState({
                            initStatus:'no-data'
                        })

                    }else if (this.state.initStatus !== 'initSucess'){
                        this.setState({
                            initStatus:'initSucess'
                        })
                    }

                }else{

                    if (this.state.dataList.length === 0){
                        this.setState({
                            initStatus:'error'
                        })
                    }
                    this.setState({refreshState: RefreshState.Failure})
                }
            },
            (e) => {
                if (this.state.dataList.length === 0){
                    this.setState({
                        initStatus:'error'
                    })
                }

                this.setState({refreshState: RefreshState.Failure})
            },
        );
    }



    _jumpWithUrl(item){


        pushJump(this.props.navigator, item.url);
    }

    _readed(item){

        if (item.readed === true){
            return;
        }
        apis.putMessageReaded().then(
            (responseData) => {

                if(responseData.code === 0){
                    item.readed = true;
                    let data = [];
                    this.state.dataList.forEach(row => {
                        data.push(Object.assign({}, row));
                    });

                    this.setState({
                        dataList:data,
                    });
                    this.state.unReadNum--;
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



    _goto(item){

        this.props.navigator.push({
            screen: 'SystemMessagePage',
            title:'消息详情',
            passProps:{
                item
            }
        });

    }

    onHeaderRefresh = () => {
        this.page=1;
        this.loadData(this.page)
    };

    onFooterRefresh = () => {
        this.page++;
        this.loadData(this.page)
    };

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
                        onHeaderRefresh={this.onHeaderRefresh}
                        onFooterRefresh={this.onFooterRefresh}
                        contentContainerStyle={{paddingTop:20,backgroundColor:'#f9f9f9'}}
                    />
                </View>
            )
        }else {
            return(
                <DefaultView onPress={()=>this.onHeaderRefresh()} type ={this.state.initStatus}/>
            )
        }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS == 'ios' ? 20 : 0,
        backgroundColor:'#f9f9f9'
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
});