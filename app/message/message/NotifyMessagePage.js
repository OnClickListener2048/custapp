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
        this._isLogined = this._isLogined().bind(this);
    }

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };


    onNavigatorEvent(event) {

        super.onNavigatorEvent(event)
        if (event.id === 'willAppear') {
            this.listener = this.refreshEmitter = DeviceEventEmitter.addListener('ReloadNotifyMessageList', () => {
                this._isLogined();
            });
        }
        if(event.id === 'willDisappear'){
            this.listener.remove();
        }
    }

    componentDidMount() {
        this._isLogined();

    }


    _isLogined(){
        UserInfoStore.isLogined().then(
            logined => {
                if (logined === true){
                    this.refreshListData();
                }else {
                    this.setState({
                        initStatus:'no-data'
                    })
                }
            },
            e => {

            }
        );
    }


    refreshListData(){

        UserInfoStore.getNotifyMessageArr().then(
            (messageArr) => {

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


        UserInfoStore.setNotifyMessageArr(data).then(
            (data) => {
                this._jumpWithUrl.bind(item);
                console.log("保存新是否已读的数据:", data);

            },
            (e) => {
            },
        );
    }

    renderCell = (info) => {
        return(
            <TouchableOpacity onPress={this._readed.bind(this,info.item)}>
                <MessageCustomCell
                    messageTitle={info.item.title}
                    messageSubTitle={info.item.content}
                    messageTime={info.item.createDate}
                    isRead={info.item.readed}
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
