/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {navToMainTab} from '../../navigation';

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
import RefreshListView, {RefreshState} from '../../view/RefreshListView'
export default class MessagePage extends BComponent {

    constructor(props) {
        super(props)

        this.state = {
            dataList: [],
            unReadNum: 0,
            refreshState: RefreshState.Idle,
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
        }
        this.page =1
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    _clearUnreadedNum(){
        if(!NetInfoSingleton.isConnected) {
            return;
        }
        apis.loadClearMessageUnReadedNum().then(
            (responseData) => {

                if(responseData.code === 0){

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

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        // console.log('ApplicationCenterPage event.type', event.type);
        if(event.id==='willAppear'){
          this._clearUnreadedNum();

        }

    }

    componentDidMount() {
        //打开即可
        if(!NetInfoSingleton.isConnected) {
            this.setState({
                initStatus:'no-net'
            })
        }else{
            this.onHeaderRefresh();
            this._loadUnreadedNum()

        }
        var self = this;
        JPushModule.setAlias('zhuangzihao',function () {
            console.log('绑定成功')
        },function () {
            console.log('绑定失败')
        })
        //notifyJSDidLoad  新版本安卓如下写法才可监听到消息回调
        JPushModule.notifyJSDidLoad(() => {
            JPushModule.addReceiveCustomMsgListener((message) => {
                console.log('111111111')

            });
        });

        // if (Platform.OS !== 'ios') {
        //
        //     JPushModule.addReceiveNotificationListener((message) => {
        //         console.log("receive notification: " + JSON.stringify(message));
        //         this._loadUnreadedNum();
        //         this.onHeaderRefresh()
        //     })
        // }else {
        //     self.JPushReceiveNotification = NativeAppEventEmitter.addListener(
        //         'ReceiveNotification',
        //         (message) => {
        //             console.log("receive notification: " + JSON.stringify(message));
        //             this._loadUnreadedNum();
        //             this.onHeaderRefresh()
        //
        //         }
        //     );
        //
        // }
    }

    onHeaderRefresh = () => {
        this.page=1
        this.loadData(this.page)
    }

    onFooterRefresh = () => {
        this.page++
        this.loadData(this.page)
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
                    })

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


                    let newList = responseData.list

                    let dataList = page === 1 ? newList : [...this.state.dataList, ...newList]
                    this.setState({
                        dataList: dataList,
                        refreshState:responseData.list.length < pageSize ? RefreshState.NoMoreData : RefreshState.Idle,
                    })

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

    _cellClick(item){
        this._readed(item);
        this._jumpWithUrl(item);

    }

    _jumpWithUrl(item){
        this.props.navigator.switchToTab({
            tabIndex: 0
        });

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

    renderCell = (info) => {
        return(
            <TouchableOpacity onPress={this._jumpWithUrl.bind(this,info.item)}>
                <MessageCustomCell
                    messageTitle={info.item.title}
                    messageSubTitle={info.item.content}
                    messageTime={info.item.createDate}
                    isRead={info.item.readed}
                />
            </TouchableOpacity>
        )
    }




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
})