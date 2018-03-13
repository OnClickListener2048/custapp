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
export default class ServiceMessagePage extends BComponent {

    constructor(props) {
        super(props);

        this.state = {
            dataList: [],
            logined : false,
            isAppear : false,
            refreshState: RefreshState.Idle,
            jpushMessage:'',
            isLoading : true,
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
        };
        this.page =1;
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };



    onNavigatorEvent(event) {
        super.onNavigatorEvent(event)
        if (event.id === 'willAppear') {
            this.listener = this.refreshEmitter = DeviceEventEmitter.addListener('ReloadServiceMessageList', () => {
                this._isLogined();

            });
        }
        if(event.id === 'willDisappear'){
            this.listener.remove();

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
            //收到登录后的通知需要刷新消息页面
            this.onHeaderRefresh();
        });

        this.refreshEmitter = DeviceEventEmitter.addListener('ClearMessage', () => {
            //收到退出后的通知需要清空消息页面,并置badge为空不提示红点
            this.setState({
                initStatus:'no-data'
            })
        });

    }

    _isLogined(){
        UserInfoStore.isLogined().then(
            logined => {
                this.setState({logined:logined});
                if (logined === true){
                    this.onHeaderRefresh();
                    this._clearUnreadedNum();

                }else {
                    this.setState({
                        initStatus:'no-data'
                    });

                }
            },
            e => {

            }
        );
    }




    _clearUnreadedNum(){
        if(!NetInfoSingleton.isConnected) {
            return;
        }

        apis.putClearMessageUnReadedNum().then(
            (responseData) => {

                if(responseData.code === 0){

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
        let loading;
        if(page===1){
            this.setState({refreshState: RefreshState.HeaderRefreshing})
            if (this.state.isLoading === true){
                loading = SActivityIndicator.show(true, "载入中...");
            }
        }else{
            this.setState({refreshState: RefreshState.FooterRefreshing})
        }

        apis.loadMessageData(pageSize,page).then(
            (responseData) => {
                if (this.state.isLoading === true){
                    SActivityIndicator.hide(loading);
                    this.setState({
                        isLoading: false,
                    });
                }
                if(responseData.code === 0){
                    let newList = responseData.list;
                    let dataList = page === 1 ? newList : [...this.state.dataList, ...newList];
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
                if (this.state.isLoading === true){
                    SActivityIndicator.hide(loading);
                    this.setState({
                        isLoading: false,
                    });
                }
                this.setState({refreshState: RefreshState.Failure})
            },
        );
    }

    _reloadPage(){
        this.setState({
            isLoading: true,
        });
        this._isLogined();

    }


    _jumpWithUrl(item){

        pushJump(this.props.navigator, item.url,item.title?item.title:'噼里啪智能财税',item.title?item.title:'噼里啪智能财税',item.content);
    }

    _readed(item){

        if (item.readed === true){
            this._jumpWithUrl(item);
            return;
        }

        this._jumpWithUrl(item);
        apis.postMessageReaded(item._id).then(
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

                }else{
                }
            },
            (e) => {

            },
        );

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
            <TouchableOpacity onPress={this._readed.bind(this,info.item)}>
                <MessageCustomCell
                    messageTitle={info.item.title}
                    messageSubTitle={info.item.content}
                    messageTime={info.item.createDate}
                    isRead={info.item.readed}
                    img={info.item.img}
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
                        contentContainerStyle={{paddingTop:10,backgroundColor:'#f1f1f1'}}

                    />
                </View>
            )
        }else {
            return(
                <DefaultView onPress={()=>this._reloadPage()} type ={this.state.initStatus}/>
            )
        }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS == 'ios' ? 20 : 0,
        backgroundColor:'#f1f1f1'
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
});
