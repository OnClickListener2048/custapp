/**
 * Created by jinglan on 2017/6/9.
 */
import React, {Component} from 'react';

import errorText from '../util/ErrorMsg';
import JPushModule from 'jpush-react-native';
import * as apis from '../apis';
import SActivityIndicator from '../modules/react-native-sww-activity-indicator';
import NoMessage from '../commonView/NoMessage';


import {
    Text,
    View,
    ListView,
    TouchableOpacity,
    AlertIndicatorIOS,
    ActivityIndicatorIOS,
    AlertIOS,
    Dimensions,
    DeviceEventEmitter,
    RefreshControl,
    ActivityIndicator

} from 'react-native';
import Toast from 'react-native-root-toast';
import CommunalNavBar from '../main/GDCommunalNavBar';
import styles from './css/MessageCenterStyle'
import MessageCell from './view/MessageCenterCell'
import Platform from "react-native";

const window = Dimensions.get('window');
const moreText = "加载完毕";
export const SCREEN_WIDTH = window.width;

import BComponent from '../base';

/** 消息中心 */
export default class MessageCenterPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2}),
            loadedStatus : '',  // loadedSucess,loadedFaild
            bagetNum : 0,
            loadingMore : 0,     //footer状态即上拉刷新的状态
            isRefreshing: false,//为了防止上拉下拉冲突
            isJumping : false, //防止重复点击
            isLoading : false,
            isNoNetwork : false,
            lastID : null,
            pageCount : 15,
        };

        this.messageArr = [];
        this._loadInitData = this._loadInitData.bind(this);
        this._loadData = this._loadData.bind(this);
        this._loadMoreData = this._loadMoreData.bind(this);
        this.toSystemMessagePage = this.toSystemMessagePage.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this._initJPush = this._initJPush.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
    };



    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        // console.log('ApplicationCenterPage event.type', event.type);
        // if(event.id==='willAppear'){
        //     this.isJumping = false;
        //
        // }
        console.log('看看到这里没有00', this.state.isJumping);

    }

    // 载入初始化数据
    _loadInitData() {

        if(!NetInfoSingleton.isConnected) {
            this.setState({
                isNoNetwork:true,
            });
            return;
        }
        this.setState({
            isNoNetwork:false,
        });

        let loading = SActivityIndicator.show(true, "加载中...");
        this.setState({
            lastID: null
        });

        apis.loadMessageData(this.state.pageCount,'').then(
            (responseData) => {

                SActivityIndicator.hide(loading);
                let cnt = responseData.unReadNum;
                if(cnt !== null && cnt >= 0) {
                    this.props.navigator.setTabBadge({
                        badge: cnt === 0 ? null : cnt // 数字气泡提示, 设置为null会删除
                    });

                    this.state.bagetNum = cnt;

                    try {// 只支持iOS
                        JPushModule.setBadge(responseData.unReadNum, (success) => {
                            console.log("Badge", success)
                        });
                    } catch (e) {
                    }
                }

                if(responseData !== null && responseData.data !== null) {
                    this.messageArr = [];
                    this.messageArr = this.messageArr.concat(responseData.data);
                    // console.log(this.messageArr)
                    for (let  i = 0 ; i < this.messageArr.length ; i++){
                        let  secData = this.messageArr[i];
                        secData.rowIndex = i;
                    }

                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.messageArr),
                        loadedStatus:'loadedSucess',
                    });

                    if (responseData.data.length === this.state.pageCount){
                        this.setState({
                            lastID: this.messageArr[this.messageArr.length - 1].msgId,
                        });

                        // console.log(this.lastID +'你大爷');
                    }else {
                        this.setState({loadingMore: 2});

                    }
                    // end()//刷新成功后需要调用end结束刷新 不管成功或者失败都应该结束
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);

                if ( this.messageArr.length > 0){
                    // 关闭刷新动画
                    this.setState({
                        loadedStatus : 'loadedSucess',

                    });
                }else {
                    // 关闭刷新动画
                    this.setState({
                        loadedStatus : 'loadedFaild',
                    });

                }
                this.props.navigator.setTabBadge({
                    badge: null // 数字气泡提示, 设置为null会删除
                });
                console.log("获取失败" , e);
                Toast.show(errorText( e ));
            },
        );
    }

    _loadData() {

        if(!NetInfoSingleton.isConnected) {
            Toast.show('暂无网络' );
            this.setState({isRefreshing: false});
            return;
        }


        this.setState({isRefreshing: true,
            lastID : null,
        });

        apis.loadMessageData(this.state.pageCount,'').then(

            (responseData) => {
                this.setState({isRefreshing: false});

                let cnt = responseData.unReadNum;
                if(cnt !== null && cnt >= 0) {
                    this.props.navigator.setTabBadge({
                        badge: cnt === 0 ? null : cnt // 数字气泡提示, 设置为null会删除
                    });

                    this.state.bagetNum = cnt;

                    try {// 只支持iOS
                        JPushModule.setBadge(cnt, (success) => {
                            console.log("Badge", success)
                        });
                    } catch (e) {
                    }
                }
                if(responseData !== null && responseData.data !== null) {
                    this.messageArr = [];
                    this.messageArr = this.messageArr.concat(responseData.data);
                    // console.log(this.messageArr)

                    if (responseData.data.length === this.state.pageCount){
                        this.setState({loadingMore: 0,
                            lastID : this.messageArr[this.messageArr.length - 1].msgId
                        });

                        // console.log(this.lastID +'你大爷');
                    }else {
                        this.setState({loadingMore: 2});

                    }

                    for (let  i = 0 ; i < this.messageArr.length ; i++){
                        let  secData = this.messageArr[i];
                        secData.rowIndex = i;

                    }

                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.messageArr),
                        loadedStatus : 'loadedSucess',

                    });



                }
            },
            (e) => {
                // 关闭刷新动画
                this.setState({isRefreshing: false});

                console.log("获取失败" , e);
                Toast.show(errorText( e ));
            },
        );
    }

    _loadMoreData() {
        if(!NetInfoSingleton.isConnected) {
            Toast.show('暂无网络' );
            return;
        }

        if (this.state.lastID === null){
            return;
        }

        if (this.state.isLoading === true){
            return;
        }
        this.setState({

            loadingMore: 1,
            isLoading : true,
        });


        apis.loadMessageData(this.state.pageCount,this.state.lastID).then(

            (responseData) => {
                let cnt = responseData.unReadNum;
                if(cnt !== null && cnt >= 0) {
                    this.props.navigator.setTabBadge({
                        badge: cnt === 0 ? null : cnt // 数字气泡提示, 设置为null会删除
                    });

                    this.state.bagetNum = cnt;

                    try {// 只支持iOS
                        JPushModule.setBadge(cnt, (success) => {
                            console.log("Badge", success)
                        });
                    } catch (e) {
                    }
                }

                this.setState({
                    lastID : null
                });


                this.messageArr = this.messageArr.concat(responseData.data);

                if (responseData.data.length === this.state.pageCount){

                    this.setState({loadingMore: 0,
                        lastID : this.messageArr[this.messageArr.length - 1].msgId});

                }else {
                    this.setState({loadingMore: 2});

                }

                //console.log("最新数据" + responseData.data.length + '条' + 'lastId' + this.state.lastID + '结束');

                for (let  i = 0 ; i < this.messageArr.length ; i++){
                    let  secData = this.messageArr[i];
                    secData.rowIndex = i;
                }

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.messageArr),
                    isLoading : false,
                    loadedStatus : 'loadedSucess',
                });



            },
            (e) => {
                // 关闭刷新动画
                console.log("获取失败" , e);
                this.setState({
                    isLoading : false
                });
                // Toast.show('获取失败' + JSON.stringify(e));
            },
        );
    }

    //已读信息
    _readed(msgid,rowData,index){


        apis.loadMessageReaded(msgid).then(

            (responseData) => {

                rowData.read = 'true';
                let data = [];
                this.messageArr.forEach(row => {
                    data.push(Object.assign({}, row));
                } );

                if (this.state.bagetNum > 0) {
                    this.state.bagetNum--;
                }

                this.props.navigator.setTabBadge({
                    badge: this.state.bagetNum <= 0 ? null : this.state.bagetNum // 数字气泡提示, 设置为null会删除
                });

                try {// 只支持iOS
                    JPushModule.setBadge(this.state.bagetNum, (success) => {
                    });
                } catch (e) {
                }

                this.messageArr = data;

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.messageArr),
                });


            },
            (e) => {
                console.log("点击失败");

                console.log("获取失败" , e);
            },
        );
    }

    componentDidMount() {
        // Toast.show('componentDidMount ' + Platform.OS + (Platform.OS === 'android'),
        //     {position: Toast.positions.TOP, duration: Toast.durations.LONG, backgroundColor: 'green'});
        // 跳转登录页的通知
        this.subscription = DeviceEventEmitter.addListener('goLoginPage', (data)=>{
            // navToLogin();
            //console.log('goLoginPage loginJumpSingleton.isJumpingLogin=', loginJumpSingleton.isJumpingLogin)
            loginJumpSingleton.goToLogin(this.props.navigator);
        });

        this.subscriptionLogin = DeviceEventEmitter.addListener('loginSuccess', (data)=>{
            console.log('我的消息 loginSuccess');
            this.props.navigator.switchToTab({
                tabIndex: 0 // (optional) if missing, this screen's tab will become selected
            });

            try {
                this._initJPush();// 确保登录时会重新绑定
                this._loadInitData();
            } catch(e) {
                console.log(e + "");
            }
        });

        this._initJPush();
    }

    _initJPush() {
        try {
            JPushModule.getRegistrationID((registrationId) => {
                console.log("Device register succeed, registrationId " + registrationId);
                apis.bindJPush(registrationId).then(
                    (responseData) => {console.log("jpush 绑定成功")},
                    (e) => {console.log("jpush 绑定失败")}
                );
                UserInfoStore.setJPushID(registrationId).then(
                    v => {},
                    e => console.log(e.message)
                );
            });

            if (Platform.OS !== 'ios') {
                JPushModule.initPush();
                JPushModule.notifyJSDidLoad();

                JPushModule.addReceiveOpenNotificationListener((message) => {
                    console.log("点击通知消息: " + JSON.stringify(message));
                });
                // JPushModule.addReceiveNotificationListener((message) => {
                //     console.log("receive notification: " + JSON.stringify(message));
                //     Toast.show('receive notification: ' + JSON.stringify(message));
                // })
            }
        } catch (e) {
            console.log('JPush error: ' + e.message);
        }

        // NativeAppEventEmitter.addListener('networkDidSetup', (token) => {
        //     this.setState({ connectStatus: '已连接' });
        // });
        // NativeAppEventEmitter.addListener('networkDidClose', (token) => {
        //     this.setState({ connectStatus: '连接已断开' });
        // });
        // NativeAppEventEmitter.addListener('networkDidRegister', (token) => {
        //     this.setState({ connectStatus: '已注册' });
        // });
        // NativeAppEventEmitter.addListener('networkDidLogin', (token) => {
        //     this.setState({ connectStatus: '已登陆' });
        // });
        //
        //
        // var subscription = NativeAppEventEmitter.addListener(
        //     'ReceiveNotification',
        //     (notification) => console.log(notification)
        // );
    }

    componentWillUnmount() {
        try {
            JPushModule.removeReceiveCustomMsgListener();
            JPushModule.removeReceiveNotificationListener();
        } catch (e) {
        }
        // 销毁
        this.subscription.remove();
        this.subscriptionLogin.remove();
    }

    componentWillMount() {
        this._loadInitData();

    }

    // 跳转到外勤通知页
    toMyOutSideWork(msgId,rowData) {
        // console.log(this.props.navigator.subarray().length);
        if (this.state.isJumping === true){
            return;
        }


        this.setState({isJumping:true});
        //防重复点击

        this.timer = setTimeout(async()=>{
            await this.setState({isJumping:false})//1.5秒后可点击
        },1000);


        let jumpUri = JSON.parse(rowData.content).jumpUri;

        let arr=jumpUri.split('?');

        let outPageId = '';
        let paramsStr1 = '';
        let paramsArr1 = [];
        let subParam1 = '';
        let specArr1 = [];

        if (arr.length > 1){
            paramsStr1 = arr[1];
            paramsArr1=paramsStr1.split('&');

            let paramsStr = arr[1];
            let paramsArr=paramsStr.split('&');

            for (let i = 0 ; i < paramsArr.length ; i++) {
                subParam1 = paramsArr[i];

                let subParam = paramsArr[i];
                specArr1 = subParam.split('=');

                let specArr = subParam.split('=');
                if (specArr.length > 1) {

                    if (specArr[0] === 'id') {
                        outPageId = specArr[1];
                        break;
                    }
                }
            }
        }

        let a = 'arrCount' + arr.length + 'msgId' + rowData.msgId  + 'content信息' + rowData.content + 'outPageId' + outPageId  + 'paramsStr' + paramsStr1 + 'paramsArrLength'
            + paramsArr1.length + 'subParam' + subParam1 + 'specArr' + specArr1.length;

        this.props.navigator.push({
            screen: 'MyOutSideTaskPage',
            backButtonTitle: '返回', // 返回按钮的文字 (可选)
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)

            passProps: {
                taskId:outPageId,
                toastStr : a,
            }
        });

        if (rowData.read === 'false'){
            this._readed(msgId,rowData);
        }

    }


    toSystemMessagePage(contentJson,msgId,rowData) {
        if (this.state.isJumping === true){
            return;
        }
        this.setState({isJumping:true});
        //防重复点击
        this.timer = setTimeout(async()=>{
            await this.setState({isJumping:false})//1.5秒后可点击
        },1000);
        this.props.navigator.push({
            screen: 'SystemMessagePage',
            backButtonTitle: '返回', // 返回按钮的文字 (可选)
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            title: '系统通知',
            passProps: {
                contentJson:contentJson,
            }
        });

        if (rowData.read === 'false'){
            this._readed(msgId,rowData);
        }
    }

    static renderTitleItem() {
        return (
            <Text style={[styles.navbarTitleItemStyle,{fontSize:18,color:'#323232'}]}>消息中心</Text>
        );
    }


    _renderRow(rowData) {

        return (
            <TouchableOpacity onPress={() => {
                rowData.type === 'outservice'? this.toMyOutSideWork(rowData.msgId,rowData) : this.toSystemMessagePage(rowData.content,rowData.msgId,rowData); }}>

                <MessageCell messageTitle={rowData.title}
                             messageSubTitle = {rowData.subTitle}
                             messageTime = {rowData.date}
                             messageIcon={rowData.type === 'outservice'?  rowData.read === 'true'? require('../img/task_y.png') :  require('../img/task.png') : rowData.read === 'true'? require('../img/system_y.png') : require('../img/system.png')}
                />

            </TouchableOpacity>
        );
    }

    renderFooter(){
        if (this.state.loadingMore === 1){
            return(
                <View style={{height:60,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <ActivityIndicator size={'small'}/>
                    <Text style={{marginLeft: 10}}>加载中...</Text>

                </View>
            );
            //加载中..
        }else if (this.state.loadingMore === 0){
            return (
                <View style={{height:40,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>


                    <View style={{height:1,width:60 ,backgroundColor:'#dcdcdc',alignItems:'center',justifyContent:'center',}}>
                    </View>

                    <Text style={{color:'#999999',marginLeft:10,marginRight:10,fontSize:12,alignItems:'center',justifyContent:'center'}}>
                        {'历史消息'}
                    </Text>
                    <View style={{height:1,width:60 ,backgroundColor:'#dcdcdc',alignItems:'center',justifyContent:'center',}}>
                    </View>
                </View>);

        }else {
            return null;
        }
    }

    // 根据网络状态决定是否渲染 ListView
    renderListView() {

        if (this.state.isNoNetwork === true) {      // 无网络
            return(
                <TouchableOpacity style={{flex : 1 , backgroundColor:'#FFFFFF'}} onPress={() => { this._loadInitData()}}>

                    <View style={{flex : 1 , backgroundColor:'#FFFFFF' }}>
                        <NoMessage
                            textContent='网络错误,点击重新开始'
                            active={require('../img/network_error.png')}/>
                    </View>
                </TouchableOpacity>
            );
        }else if (this.state.loadedStatus === '') {      // 没什么错但是还没开始请求数据

            return(
                <View style={[{flex : 1 , backgroundColor:'#FFFFFF' }]}>
                </View>
            );
        }else if (this.state.loadedStatus === 'loadedFaild') {      // 数据加载失败
            return(
                <TouchableOpacity style={{flex : 1 , backgroundColor:'#FFFFFF'}} onPress={() => { this._loadInitData()}}>

                    <View style={{flex : 1 , backgroundColor:'#FFFFFF' }}>
                        <NoMessage
                            textContent='加载失败，点击重试'
                            active={require('../img/load_failed.png')}/>
                    </View>
                </TouchableOpacity>
            );
        }else if (this.messageArr.length === 0){

            return(
                <TouchableOpacity style={{flex : 1 , backgroundColor:'#FFFFFF'}} onPress={() => { this._loadInitData()}}>

                    <View style={{flex : 1 , backgroundColor:'#FFFFFF' }}>
                        <NoMessage
                            textContent='暂无消息'
                            active={require('../img/no_message.png')}/>
                    </View>
                </TouchableOpacity>

            );
        }else {         // 有数据
            return(

                <ListView    style={[{flex : 1 }]}
                             dataSource={this.state.dataSource}
                             onEndReached={this._loadMoreData}
                             renderFooter={this.renderFooter}
                             enableEmptySections={true}
                             onEndReachedThreshold={10}
                             renderRow={this._renderRow.bind(this)}
                             refreshControl = {
                                 <RefreshControl
                                     refreshing={this.state.isRefreshing}
                                     onRefresh={this._loadData}
                                     title={'加载中...'}
                                     titleColor={'#b1b1b1'}
                                     colors={['#ff0000','#00ff00','#0000ff','#3ad564']}
                                     progressBackgroundColor={'#fafafa'}
                                 />
                             }
                />

            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <CommunalNavBar
                    titleItem={() => MessageCenterPage.renderTitleItem()}
                />
                {this._renderNetWorkView()}
                {this.renderListView()}

            </View>
        );
    }
}




